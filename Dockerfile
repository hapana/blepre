FROM golang:1.8-stretch

RUN apt-get install -y git

RUN go get -d -v github.com/shimomo/ibeacon-scanner
RUN go get -d -v github.com/smallfish/simpleyaml
RUN go get -d -v github.com/jamesmillerio/go-ifttt-maker
#RUN go install -v
