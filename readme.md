# 工作空间同步

```sh
# 生成空间配置
node ./wss/dist/wss.js sync ~/Engineerings -e "00-research" "test" "tmp" "py_es"

# 删除配置
curl -X 'DELETE' 'https://62d366beafb0b03fc5b2a55f.mockapi.io/wss/2'

# 上传
node ./wss/dist/wss.js m https://62d366beafb0b03fc5b2a55f.mockapi.io/wss upload --key-as directory -c overwrite

```

## Simple-Git

<https://github.com/steveukx/git-js#readme>

## Commander

<https://github.com/tj/commander.js>
