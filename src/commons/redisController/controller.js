import redis from 'redis'


class Redis {
  constructor() {
    var redisClient = redis.createClient
    this.redis = redisClient(process.env.REDIS_PORT || '6379', process.env.REDIS_HOST || 'localhost');
    this.redis.on("error", (err) => {
      console.log('redis error', err)
    });
  }

  setToRedis(key, value) {
    this.redis.set(key, JSON.stringify(value), (err) => {
      if (err)
        console.log(err);
    });
  }

  getFromRedis(key, cb) {
    this.redis.get(key, (err, data) => {
      if (err || data == null) {
        cb && cb({ status: false, result: "No Data Found" });
      } else {
        cb && cb({ status: true, result: JSON.parse(data) });
      }
    });
  }
}

const redisController = new Redis();
export default redisController;