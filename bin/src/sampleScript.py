import sys
from time import sleep
import functools
print = functools.partial(print, flush=True)

print("Received the following arguments:")
print(" ".join(sys.argv))

for i in range(100):
    sleep(0.1)
    print(str(i) + ": Sample Output")

