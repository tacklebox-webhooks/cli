let idempotencyKey = 0;

function setBody(requestParams, context, ee, next) {
  idempotencyKey += 1;
  requestParams.body["idempotency_key"] = String(idempotencyKey);
  requestParams.body["event_type"] = "load-test";
  requestParams.body["payload"] = {
    message: `Hello from Artillery! Message #${idempotencyKey}`
  };
  requestParams.body = JSON.stringify(requestParams.body);
  next();
}

module.exports = {
  setBody
};