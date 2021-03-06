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

## Big-O

In the example, the function expressing the number of calculations is given as **T(n)**.

How is **T(n)** determined? Simply count each statement. Function calls, assignments, operations, loop or branch statements, return call, etc. This is an approximation of course, as it ignores different execution times in operations, for example floating point versus integer arithmetic, and it also ignores operations which require access to memory.

In the example the first version of the algorithm **T(n) = 2n²**. In the second version of the algorithm **T(n) = n² + n**.

Rather than determining the exact number of calculations **T(n)**, a Big-O analysis gives an indication in the order of magnitude. The Big-O notation is **O(f(n))**, this can be read as Big-O of the function (f) given a number of elements (n). Only the highest order term of **T(n)** is considered, lower order terms and constants are ignored.

In both cases of the example algorithm the Big-O is given by **O(n²)**.

### Classes of algorithms

Time-complexity functions f(n) are selected from a small set of functions:

| f( ) | Common name |
| ----- | ----- |
| 1 | constant |
| log(n) | logarithmic |
| n | linear |
| n log(n) | log linear |
| n² | quadratic |
| n^m | polynomial |
| a^n | exponential |
| n! | factorial |  

A couple of examples of algorithms and their respective Big-O:

```python
def sum(n):
    total = 0
    for i in range(n):
        total += i
    return total
```

This sum function loops over the range n so it is O(n).

```python
def sum2(n):
    total = 0
    for i in range (n):
        for j in range(n):
            total += 1
    return total
```

The sum2 function has a nested loop and the inner statements are executed n*n times. So it is O(n²).

```python
def sum3(n):
    total = 0
    for i in range (n):
        for j in range(i):
            total += 1
    return total
```

The sum3 function has a nested loop and the inner statements are executed n*i times. Although sum3 will definitely execute less addition operations than sum2, i will eventually approximate n. So sum3 is also O(n²).

```python
def sum4(n):
    total = 0
    i = n
    while i >= 1:
        total += 1
        i = i / 2
    return total
```

The sum4 function has a loop iterator which halves each iteration. This approximates the binary log function. This leads to O(log n).

```python
def sum5(n):
    total = 0
    for i in range(n):
        total += sum4(n)
    return total
```

The sum5 function loops over the range of n. In this loop sum4 is called, thus calling sum4 n times. The sum5 function is O(n log n).

If the algorithm short-circuits its computation given a condition, the best case, average case and worst case might differ. An example:

```python
# returns the position of the first negative number in a list
# if the list does not contain any negative numbers it will return -1
def containsNN(l):
    for i in range(len(l)):
        if l[i] < 0:
            return i
    return -1

list1 = [3, 45, 1, 17, 12, 32, 22, 89, 15, 77]
list2 = [-12, 45, 1, 17, 12, 32, 22, 89, 15, 77]
```

Calling containsNN on list1 loops over the whole list, while on list2 the function immediately returns. Most of the time, in Big-O the worst case is considered. In some algorithms, the average case and worst case wildly differ, e.g. Quicksort. In a Big-O analysis this is typically mentioned explicitly.

Let's apply the Big-O analysis to two classic algorithms.

### Insertion sort

Insertion sort is a sorting algorithm which is effective on small data sets. The following algorithm sorts a list from small to large.

Insertion sort starts with a key (indicated in blue) on the second element. All elements in green could be considered as already sorted at the start of each pass. Starting with a new pass insertion sort selects the next element as the new key, until all elements in the list are selected.

The key is compared with the element to the left, if the element selected by the cursor is smaller, that element is moved to the right. If the element to the left is larger or the end of the list is reached, the key is inserted at the cursor and the next pass starts.

![Insertion sort visualization](./assets/insertion.png)

Insertion sort in Python:

```python
def insertionSort(arr):
   for i in range(1, len(arr)):
      key = arr[i]
      cursor = i-1
      while cursor >=0 and key < arr[cursor]:
         arr[cursor+1] = arr[cursor]
         cursor -= 1
      arr[cursor+1] = key
```

Analyzing the insertion sort algorithm reveals two loops. In the worst case, when the array is sorted the other way around, each insertion pass has to traverse the entire array. Then it follows that the Big-O of insertion sort is O(n²).

### Binary search

Binary search returns the index of a number in a list. If the number is not present in the list, the algorithm returns -1.

A naive search approach would be iterating the entire list, searching for the number. This approach has a Big-O of O(n).

Binary search performs better than the naive approach. However, it requires that the list is sorted.

The algorithm starts at the middle of the list. The three scenarios are possible:

1. If the number is found at this position, then binary search can happily return the result. 
1. If the number in the middle is larger than the number to be found, then it is known that the number to be found should be in the lower half.
1. If the number in the middle is smaller than the number to be found, it should be in the upper half.  

In scenario 2 or 3 the algorithm is repeated, yet only the relevant sublist is searched. If the sublist is empty, then the number has not been found and the algorithm returns -1.

![Binary search visualization](./assets/binarysearch.png)

Binary search could be implemented with a while loop:

```python
def binarySearch(arr, n):  
    low = 0  
    high = len(arr) - 1  
    mid = 0  
  
    while low <= high:  
        mid = (high + low) // 2  
        if arr[mid] == n:
            return mid
        elif arr[mid] < n:  
            low = mid + 1  
        else:
            high = mid - 1  
    return -1  
```

Analysis of the binary search algorithm reveals it actually halves the list to be searched in each pass. This corresponds with O(log n).

:::tip
Binary search could also be implemented recursively. Note the nested function innerSearch, which is needed to expand the argument list:

```python
def binarySearch(arr, n):  
    # the nested function is needed to include the low and high parameters
    def innerSearch(arr, n, low, high):
        if low > high:
            return -1

        mid = (low + high) // 2

        if arr[mid] == n:
            return mid

        elif n > arr[mid]:
            return innerSearch(arr, n, mid+1, high)

        else:
            return innerSearch(arr, n, low, mid-1)

    # this return belongs to the binarySearch function
    # it immediately calls the nested function
    # with values which bootstrap the recursive function
    return innerSearch(arr, n, 0, len(arr)-1)
```

A recursive implementation of the algorithm does not change the Big-O. Binary search, even implemented recursively, remains O(log n).
:::
