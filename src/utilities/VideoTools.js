import { Storage } from "aws-amplify";

const checkS3PrefixReady = async (fileName, prefix) => {
  const videoName = fileName.split(".")[0];
  // ready true if video is ready, false if not
  return await Promise.all([
    Storage.list(videoName + "/", {
      customPrefix: {
        public: prefix,
      },
    }),
    Storage.list(videoName + ".m3u8", {
      customPrefix: {
        public: "output/hls/",
      },
    }),
  ]);
};

const deleteS3Prefix = async (videoName, prefix) => {
  await Storage.list(videoName + "/", {
    customPrefix: {
      public: prefix,
    },
  })
    .then((files) => {
      files.map((file) => {
        Storage.remove(file.key, {
          customPrefix: {
            public: prefix,
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

async function deleteVideo(videoName, thumbName) {
  await Promise.all([
    // delete S3 storage output m3u8
    Storage.remove(videoName + ".m3u8", {
      customPrefix: {
        public: "output/hls/",
      },
    }),
    // delete S3 storage output mpd
    Storage.remove(videoName + ".mpd", {
      customPrefix: {
        public: "output/dash/",
      },
    }),
    // delete S3 storage output videos
    deleteS3Prefix(videoName, "output/hls/"),
    deleteS3Prefix(videoName, "output/dash/"),
    // delete S3 storage input video
    Storage.remove(videoName, {
      customPrefix: {
        public: "input/",
      },
    }),
    Storage.remove(thumbName),
  ]).catch(console.log);
}

export { checkS3PrefixReady, deleteVideo };
