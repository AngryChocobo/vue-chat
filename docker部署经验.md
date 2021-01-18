# docker

1. 项目的 dockerfile 中 EXPOSE 的端口，是项目将在 docker 中运行的端口号 (似乎配置非 80 则会导致请求失败)

2.  使用 docker container create -p aaaa:bb 创建容器时，bb 是容器的端口，aaaa 是宿主机的端口

3. 服务器里 nginx 里配置的端口，是宿主机的端口

所以，项目的 dockerfile 的端口配置为 80， 则应该用 docker container create -p 3000:80 来创建容器，然后 nginx 配置端口 3000 就能访问到项目了

当修改源码后。需要重新部署服务端：

1. 首先 git push 触发 travis ci 重新 build docker 镜像
2. 然后去服务器 docker container stop xxx
3. 之后 docker container ls 检查一下容器列表（本来以为 stop 只是停掉容器，还需要手动删除，但是似乎已经自动删掉了）
4. 重新拉取镜像 docker pull chocobodocker/vue-chat:latest
5. 重新生成容器 docker container create -p 8888:100 chocobodocker/vue-chat:latest
6. 运行镜像 docker container start xxx (start 和 run 有什么区别？)
