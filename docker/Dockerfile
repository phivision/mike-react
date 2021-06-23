FROM amazonlinux:2
MAINTAINER Amazon AWS

# Framework Versions
ENV VERSION_NODE_14=14.15.5
ENV VERSION_YARN=1.22.5
ENV VERSION_AMPLIFY=5.0.1

# UTF-8 Environment
ENV LANGUAGE en_US:en
ENV LANG=en_US.UTF-8
ENV LC_ALL en_US.UTF-8

## Install OS packages
RUN touch ~/.bashrc
RUN yum -y update && \
    yum -y install \
        alsa-lib-devel \
        autoconf \
        automake \
        bzip2 \
        bzip2-devel \
        bison \
        bzr \
        cmake \
        expect \
        fontconfig \
        git \
        gcc \
        gcc-c++ \
        make \
        GConf2-devel \
        gtk2-devel \
        gtk3-devel \
        libnotify-devel \
        libpng \
        libpng-devel \
        libffi-devel \
        libtool \
        libX11 \
        libXext \
        libxml2 \
        libxml2-devel \
        libXScrnSaver \
        libxslt \
        libxslt-devel \
        libyaml \
        libyaml-devel \
        nss-devel \
        openssl-devel \
        openssh-clients \
        patch \
        procps \
        python3 \
        python3-devel \
        python3.8-pip \
        readline-devel \
        sqlite-devel \
        tar \
        tree \
        unzip \
        wget \
        which \
        xorg-x11-server-Xvfb \
        zip \
        zlib \
        zlib-devel \
    yum clean all && \
    rm -rf /var/cache/yum

## Instal Python 3.8
RUN export BASE_PATH=$(pwd)
RUN cd /opt && wget https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tgz
RUN cd /opt && tar xzf Python-3.8.2.tgz
RUN cd /opt/Python-3.8.2 && ./configure --enable-optimizations
RUN cd /opt/Python-3.8.2 && make altinstall
RUN pip3.8 install --user pipenv
RUN ln -fs /usr/local/bin/python3.8 /usr/bin/python3
RUN ln -fs /usr/local/bin/pip3.8 /usr/bin/pip3
RUN cd $BASE_PATH

## Install Node 14
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
RUN curl -o- -L https://yarnpkg.com/install.sh > /usr/local/bin/yarn-install.sh
RUN /bin/bash -c ". ~/.nvm/nvm.sh && \
	nvm install $VERSION_NODE_14 && nvm use $VERSION_NODE_14 && \
	npm install -g sm grunt-cli bower vuepress gatsby-cli && \
    bash /usr/local/bin/yarn-install.sh --version $VERSION_YARN && \
	nvm alias default node && nvm cache clear"

## Install awscli
RUN /bin/bash -c "pip3 install awscli && rm -rf /var/cache/apk/*"

## Install SAM CLI
RUN /bin/bash -c "pip3 install aws-sam-cli"

## Installing Cypress
RUN /bin/bash -c ". ~/.nvm/nvm.sh && \
    nvm use ${VERSION_NODE_14} && \
    npm install -g --unsafe-perm=true --allow-root cypress"

## Install AWS Amplify CLI for VERSION_NODE_DEFAULT
RUN /bin/bash -c ". ~/.nvm/nvm.sh && nvm use ${VERSION_NODE_14} && \
    npm config set user 0 && npm config set unsafe-perm true && \
	npm install -g @aws-amplify/cli@${VERSION_AMPLIFY}"

## Environment Setup
RUN echo export PATH="\
/root/.yarn/bin:\
/root/.config/yarn/global/node_modules/.bin:\
/root/.nvm/versions/node/${VERSION_NODE_14}/bin:\
$(python3 -m site --user-base)/bin:\
$PATH" >> ~/.bashrc  && \
    echo "nvm use ${VERSION_NODE_14} 1> /dev/null" >> ~/.bashrc

ENTRYPOINT [ "bash", "-c" ]