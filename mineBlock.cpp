#include <node.h>
#include <string>
#include "./PicoSHA2/picosha2.h"

namespace blockMiner {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Null;
using v8::Number;

static bool startsWith(const std::string& s, const std::string& prefix) {
    return s.size() >= prefix.size() && s.compare(0, prefix.size(), prefix) == 0;
}

std::string do_hash(std::string input, int* nonce) {
  std::vector<unsigned char> hash(picosha2::k_digest_size);
  std::string hashed_string = input;
  std::string tmp;
  do {
    tmp = input + std::to_string(*nonce);
    picosha2::hash256(tmp.begin(), tmp.end(), hash.begin(), hash.end());
    hashed_string = picosha2::bytes_to_hex_string(hash.begin(), hash.end());
    *nonce += 1;
  } while ((!startsWith(hashed_string, "0000")));
  return hashed_string;
}

void mine_block(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Object> result = Object::New(isolate);
  int nonce = 0;
  String::Utf8Value inputArg(args[0]->ToString());
  std::string input = std::string(*inputArg);
  std::string hashed_string = do_hash(input, &nonce);
  result->Set(String::NewFromUtf8(isolate, "hash"), String::NewFromUtf8(isolate, hashed_string.c_str()));
  result->Set(String::NewFromUtf8(isolate, "nonce"), Number::New(isolate, nonce));
  args.GetReturnValue().Set(result);
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "mine", mine_block);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}