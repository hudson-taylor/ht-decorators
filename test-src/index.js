
import assert from "assert";

import ht from "hudson-taylor";
import s  from "ht-schema";

import { expose } from "../lib";

describe("HT Decorators", function() {

  let transport, service, client;
  
  before(function() {

    transport = new ht.Transports.Local();

    service = new ht.Service(transport);

    client = new ht.Client({
      s: transport
    });

  });

  describe("expose", function() {

    it("should expose class method as service method", function(done) {

      class exposeTest1 {
        @expose(service);
        exposeTest1MethodEcho(data, callback) {
          return callback(null, data);
        }
      }

      new exposeTest1();

      client.call("s", "exposeTest1MethodEcho", "hello world", function(err, data) {
        assert.ifError(err);
        assert.equal(data, "hello world");
        done();
      });

    });

    it("should accept schema", function(done) {

      let schema = s.Object({
        data: s.String()
      });

      class exposeTest2 {
        @expose(service, schema);
        exposeTest2MethodEcho(data, callback) {
          return callback(null, data.data);
        }
      }

      new exposeTest2();

      client.call("s", "exposeTest2MethodEcho", 5, function(err) {
        assert.equal(err.error, "Got number, required Object");
        client.call("s", "exposeTest2MethodEcho", { data: "Hi" }, function(err, response) {
          assert.ifError(err);
          assert.equal(response, "Hi");
          done();
        });
      });

    });

  });

});
