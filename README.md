# pngzip
压缩png图片

format:

``` bash
node ./pngzip.js <path> -e="<ingore fileStart with>"

```
example: convert **/mnt/png** dir, excule filename start with **_wp__** or **_p__**

``` bash
node ./pngzip.js /mnt/png -e="wp_,p_"
```

* -e excule filename start with
