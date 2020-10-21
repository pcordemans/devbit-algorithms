---
title: Complexity Analysis
---

# Complexity Analysis

Many programming solutions may exist for a given problem. Question is: which is the most efficient?

A simple approach is to measure execution time of the algorithm:

```python
import time

begin = time.time()

#replace this function call with your code under test
time.sleep(5)

end = time.time()

print(f"Time elapsed: {end - begin}")
```

There are also more sophisticated [profiler](https://docs.python.org/3/library/profile.html) tools.

:::warning
As the famous computer scientist Donald Knuth said: Premature optimization is the root of all evil. This is a warning to only start profiling code when there is a problem.
:::

Measuring execution time (or memory usage) might be a good idea, but these factors depend on:

1. Amount of data used in the algorithm
1. Hardware of the computer
1. Other applications running on the computer
1. The programming language used (or the compiler, interpreter, etc.)
1. The algorithm must be implemented before it can be measured

An alternative is to analyse the complexity of the algorithm, both running time and space usage.

An example:

```python
import numpy as np

rows = 3
cols = 5
a = np.arange(rows*cols).reshape(rows, cols)

totalSum = 0
rowSum = np.zeros(rows, dtype=np.int32)

for i in range(rows):
    for j in range(cols):
        rowSum[i] += a[i][j]
        totalSum += a[i][j]

print(totalSum)
print(rowSum)
```

The NumPy library is used to construct a matrix with 3 rows and 5 columns. The algorithm sums each of the rows and calculates the total sum of all elements in the matrix.

The total number of additions is 2\* rows \* columns = 30 (in this case).

Is it possible to change the algorithm so the number of additions is lower?

```python
for i in range(rows):
    for j in range(cols):
        rowSum[i] += a[i][j]
    totalSum += rowSum[i]
```

In this version of the algorithm the total number of additions is rows * colums + rows = 18 (in this case)

:::tip
NumPy actually has built-in functions for both purposes. These are highly optimized and should be used instead of writing your own code.

```python
a.sum() #sums all elements in the array
a.sum(axis=1) #sums the elements per row, use axis=0 to select the columns
```

:::

Changing the dimensions of the matrix to make it a square matrix with dimensions n, it is possible to calculate the number of additions in both algorithms and compare them.

| dimension n | 1st algorithm (2n²) | 2nd algorithm (n²+n)  |
| -----: |-----:| -----:|
| 10| 200 |  110 |
| 100| 20 000 |  10 100 |
| 1 000| 2 000 000 |  1 001 000 |
| 10 000| 200 000 000 |  100 010 000 |
| 100 000| 20 000 000 000 |  10 000 100 000 |
