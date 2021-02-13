# Overview
This is simple sample
- obniz
- mh_z19

# how to use
## install modules

```nodejs
npm install
```

## input obniz ID in mh_z19.js
 
```
obniz = new Obniz("xxxx-xxxx");
```


## set the mh_z19 sensor and obniz.


|  obniz PIN |  MH_Z19  |
| ---- | ---- |
|  0  |  TxD  |
|  1  |  RxD  |
|  10  |  v+  |
|  11 |  GND(V-)  |


## run server

run the following command.

```nodejs
npm start
```