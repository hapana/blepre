package main

import (
    "fmt"
    "io/ioutil"
    "path/filepath"

    "github.com/smallfish/simpleyaml"
    "github.com/jamesmillerio/go-ifttt-maker"
    "github.com/shimomo/ibeacon-scanner"
)

func main() {

    configPath, _ := filepath.Abs("./config.yml")
    config, err := ioutil.ReadFile(configPath)
    if err != nil {
        panic(err)
    }

    yaml, err := simpleyaml.NewYaml(config)
    if err != nil {
        panic(err)
    }

    room, err := yaml.Get("room").String()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Room: %#v\n", room)

    makerkey, err := yaml.Get("maker").Get("key").String()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Maker Key: %#v\n", makerkey)

    onevent, err := yaml.Get("rooms").Get(room).Get("on-event").String()
    if err != nil {
        panic(err)
    }
    fmt.Printf("On-Event: %#v\n", onevent)

    offevent, err := yaml.Get("rooms").Get(room).Get("off-event").String()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Off-Event: %#v\n", offevent)

    lowsignal, err := yaml.Get("rooms").Get(room).Get("low-signal").Int()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Low-Signal: %#v\n", lowsignal)

    highsignal, err := yaml.Get("rooms").Get(room).Get("high-signal").Int()
    if err != nil {
        panic(err)
    }
    fmt.Printf("High-Signal: %#v\n", highsignal)

    whitelist, err := yaml.Get("whitelist").Array()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Value: %#v\n", whitelist)

    maker := new(GoIFTTTMaker.MakerChannel)

    ibeacon.Scan(func(uuid string, major string, minor string, rssi int) {
        var devices = make(map[string]bool)
        for i := 0; i < len(whitelist); i += 1 {
            v := whitelist[i]
            devices[v.(string)] = false
            if v == uuid {
                if lowsignal < rssi && rssi < highsignal {
                    if devices[v.(string)] == false {
                        maker.Send(makerkey, onevent)
                        devices[v.(string)] = true
                        fmt.Println(uuid)
                        //fmt.Println(major)
                        //fmt.Println(minor)
                        fmt.Println(rssi)
                    }
                }else{
                    devices[v.(string)] = false
                    for _, v := range devices {
                        if v != true {
                            maker.Send(makerkey, offevent)
                        }
                    }
                }
            }else{
                fmt.Println("UUID not allowed: %#u\n", uuid)
            }
        }
    }, 1000)
}
