let iKey = 0;

function setBody(requestParams, context, ee, next) {
  iKey += 1;
  requestParams.body["idempotency_key"] = String(iKey);
  requestParams.body["event_type"] = "load-test";
  requestParams.body["payload"] = {
    message: `Hello from Artillery! Message #${iKey}`
  };
  requestParams.body = JSON.stringify(requestParams.body);
  next();
}

module.exports = {
  setBody
};