var AWS = require("aws-sdk");
var mediaconvert = new AWS.MediaConvert({ apiVersion: "2017-08-29" });

const MEDIACONVERT_ROLE = process.env.JOB_ROLE;
const PACKAGE_TYPE = process.env.PACKAGE_TYPE;
const INPUT_PREFIX = fixForPrefix(process.env.INPUT_PREFIX);
const OUTPUT_PREFIX = fixForPrefix(process.env.OUTPUT_PREFIX);

//helper function to address scenarios where user does not enter the
//trailing '/' in 'input' and 'output' prefix
function fixForPrefix(folderName) {
  if (!folderName.endsWith("/")) {
    folderName = folderName + "/";
  }
  return folderName;
}

let INITIALISED = false;

exports.handler = async (event, context, callback) => {
  console.log("Event Object :%j", event);

  //create the transcoding job
  const job = await createJob(event);
  //initialize the MediaConvert Endpoint with account specific endpoint only if not done already.
  if (!INITIALISED) {
    await setMediaConvertEndpoint(mediaconvert);
    await setMediaConvertQueue(job);
    INITIALISED = true;
  } else {
    await setMediaConvertQueue(job);
  }
  await submitJob(job, callback);
  // .catch(err => console.log("Error :%j", err));
};

//set the Default Queue Arn
async function setMediaConvertQueue(job) {
  const params = {
    Name: "Default" /* required */,
  };

  const queue = await mediaconvert.getQueue(params).promise();
  job.Queue = queue.Queue.Arn;
}

//set the AWS Account specific mediaconvert endpoint
async function setMediaConvertEndpoint(mediaconvert) {
  // Create empty request parameters
  const params = {
    MaxResults: 0,
  };

  const endpoint = await mediaconvert.describeEndpoints(params).promise();
  mediaconvert.endpoint = endpoint.Endpoints[0].Url;
}

//create the job with input and output configurations for HLS and DASH
function createJob(event) {
  const packageTypes = PACKAGE_TYPE.split("|");
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  const orientation = key.split("_")[0].split("/")[1];
  console.log("Input file orientation: ", orientation);
  console.log("Package types :%j", packageTypes);
  // console.log("Package type 1:%s", packageTypes[1]);

  let params = {
    Queue: "",
    Role: MEDIACONVERT_ROLE,
    UserMetadata: { S3Bucket: bucket, S3Key: key },
    Settings: {
      OutputGroups: [],
      AdAvailOffset: 0,
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              Offset: 0,
              DefaultSelection: "NOT_DEFAULT",
              ProgramSelection: 1,
              SelectorType: "TRACK",
              Tracks: [1],
            },
          },
          VideoSelector: {
            ColorSpace: "FOLLOW",
            Rotate: "AUTO",
          },
          FilterEnable: "AUTO",
          PsiControl: "USE_PSI",
          FilterStrength: 0,
          DeblockFilter: "DISABLED",
          DenoiseFilter: "DISABLED",
          TimecodeSource: "EMBEDDED",
          FileInput: "s3://" + bucket + "/" + key,
        },
      ],
      TimecodeConfig: {
        Source: "EMBEDDED",
      },
    },
  };

  packageTypes.forEach(function (packageType, index, array) {
    console.log("Type,index :", packageType, index, array);
    const type = packageType.split(":");
    let output = {};
    let outputGroupSettings = {};
    if (type[0] === "hls") {
      output.Name = "HLS";
      output.Outputs = [];
      const profiles = type[1].split(",");

      profiles.forEach(function (profile) {
        const profileOrient = profile.split("_")[0];
        // use matched profile for media convert
        if (
          orientation === profileOrient ||
          (orientation !== "Portrait" && profileOrient !== "Portrait")
        ) {
          let preset = {};
          preset.Preset = profile;
          preset.NameModifier = "/" + profile; //"/preset-" + ind;
          output.Outputs.push(preset);
        }
      });
      outputGroupSettings.Type = "HLS_GROUP_SETTINGS";
      let hlsSettings = {};
      hlsSettings.ManifestDurationFormat = "INTEGER";
      hlsSettings.Destination =
        "s3://" +
        bucket +
        "/" +
        OUTPUT_PREFIX +
        type[0] +
        "/" +
        getContentPrefix(key);
      hlsSettings.SegmentLength = 4;
      hlsSettings.TimedMetadataId3Period = 10;
      hlsSettings.CaptionLanguageSetting = "OMIT";
      hlsSettings.TimedMetadataId3Frame = "PRIV";
      hlsSettings.CodecSpecification = "RFC_4281";
      hlsSettings.OutputSelection = "MANIFESTS_AND_SEGMENTS";
      hlsSettings.ProgramDateTimePeriod = 600;
      hlsSettings.MinSegmentLength = 0;
      hlsSettings.DirectoryStructure = "SINGLE_DIRECTORY";
      hlsSettings.ProgramDateTime = "EXCLUDE";
      hlsSettings.SegmentControl = "SEGMENTED_FILES";
      hlsSettings.ManifestCompression = "NONE";
      hlsSettings.ClientCache = "ENABLED";
      hlsSettings.StreamInfResolution = "INCLUDE";
      outputGroupSettings.HlsGroupSettings = hlsSettings;
      output.OutputGroupSettings = outputGroupSettings;
      params.Settings.OutputGroups.push(output);
    } else if (type[0] === "dash") {
      output.Name = "DASH ISO";
      output.Outputs = [];
      let profiles = type[1].split(",");

      profiles.forEach(function (profile, ind) {
        let preset = {};
        preset.Preset = profile;
        preset.NameModifier = "/" + profile; //"/preset-" + ind;
        output.Outputs.push(preset);
      });
      output.Outputs.push({
        Preset: "System-Ott_Dash_Mp4_Aac_He_96Kbps",
        NameModifier: "/preset-0_Ott_Dash_Mp4_Aac_He_96Kbps",
      });
      outputGroupSettings.Type = "DASH_ISO_GROUP_SETTINGS";
      let dashSettings = {};
      dashSettings.SegmentLength = 4;
      dashSettings.Destination =
        "s3://" +
        bucket +
        "/" +
        OUTPUT_PREFIX +
        type[0] +
        "/" +
        getContentPrefix(key);
      dashSettings.FragmentLength = 2;
      dashSettings.SegmentControl = "SEGMENTED_FILES"; //"SINGLE_FILE"
      dashSettings.HbbtvCompliance = "NONE";
      outputGroupSettings.DashIsoGroupSettings = dashSettings;
      output.OutputGroupSettings = outputGroupSettings;
      params.Settings.OutputGroups.push(output);
    }
  });

  return params;
}

//Submit the job to the MediaConvert service
async function submitJob(job, callback) {
  console.log("Job to be submitted :%j", job);

  await mediaconvert
    .createJob(job)
    .promise()
    .then(
      function (data) {
        console.log("Job created! ", data);
        callback(null, "Done");
      },
      function (err) {
        console.log("Error", err);
        callback(err, "Failed");
      }
    );
}

//cleanup the input filename removing all non-alphanumeric characters
//to arrive at the output folder name where trancoded assets will be stored in S3
function getContentPrefix(key) {
  console.log("In getContentPrefix with key :%s", key);
  key = key.replace(INPUT_PREFIX, "");
  key = key.substring(0, key.lastIndexOf(".")) + "/";
  key = key.replace(/[^a-zA-Z0-9]/g, "");
  return key;
}
