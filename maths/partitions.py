import numpy as np
import pandas as pd
# yeld the partitions of an integer n
def partitions(n, I=1):
    yield (n,)
    for i in range(I, n//2 + 1):
        for p in partitions(n-i, i):
            yield (i,) + p

#compute all different difference of a tuple
def listDiff(integerTuple):
    b = np.array(list(set(integerTuple)))
    c = abs(b[..., np.newaxis]-b)
    d = set(c.ravel())
    return d

listOfPartitions = list(partitions(12))
listsOfDiff = list(map(listDiff, listOfPartitions))
listOfElementCount = list(map(len, listOfPartitions))
print(listOfPartitions)
print( listsOfDiff)
print( listOfElementCount)

d = { 'partitions' : listOfPartitions, 'diffs': listsOfDiff, 'count':listOfElementCount}
df = pd.DataFrame(data=d)

ef = df.sort_values(['count'])
print(ef.to_string())