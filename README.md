# auto-camera
tera-proxy module to unlock maximum viewing distance

## Dependency
- `Command` module

## Usage
- __`camera` · `cam`__
  - Toggle on/off
- __`camera num` · `cam num`__
  - Set distance at `num`, where `num` is a value between `0` and `99999`

## Config
- __`enable`__
  - Initialize module on/off
  - Default is on
- __`defaultDistance`__
  - Initialize camera distance
  - Default distance is `800`

## Info
- Original author : [teralove](https://github.com/teralove)
- Normal camera maximum distance is 500
- Harrowhold camera maximum distance is 1200
- By default, the initial viewing distance (not max) when you login is 170

## Changelog
<details>

    1.46
    - Added auto-update support
    - Refactored config file
    -- Added `enable`
    -- Added `defaultDistance`
    1.45
    - Updated name and font color
    1.44
    - Updated code aesthetics
    1.43
    - Updated code
    - Added string function
    1.42
    - Updated code aesthetics
    1.41
    - Updated code aesthetics
    1.31
    - Updated code
    1.30
    - Updated code
    - Removed protocol version restriction
    1.21
    - Added Command dependency
    - Removed slash support
    1.20
    - Initial Fork
    1.1.0
    - Changed command to require exclamation prefix '!'
    - Added slash support

</details>

---
![Screenshot](http://i.imgur.com/LzxGSgm.jpg)