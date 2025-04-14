#include <emscripten.h>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int func(int a, int b) {
        return a + b;
    }
}