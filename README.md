# bustw-server

Bus tracker for Taiwan 🇹🇼

## Dependencies

- `redis`

## Usage

### `Docker`

```bash
docker run --name bustw-server \
-e PTX_APP_ID='<PTX_APP_ID>' \
-e PTX_APP_KEY='<PTX_APP_KEY>' \
-e REDIS_HOST='172.17.0.1' \
-p 3000:3000 \
--restart=always -d \
pinlin/bustw-server
```

### Manual

```bash
# Install dependencies
npm install

# Run on development mode
npm run start:dev
# Run on production mode
npm run build
npm run start:prod
```

## License
[MIT License](LICENSE)

## Data Source
[![公共運輸整合資訊流通服務平臺（Public Transport data eXchange, PTX）](https://imgur.com/wp2gOeU.png)](http://ptx.transportdata.tw/PTX)
