---
title: Linked Lists
---

# Linked Lists

Linked lists are a basic data structure. Whereas conventional arrays are created with a fixed size, linked lists grow or shrink dynamically. In contrast, in an array elements can be accessed by their index, in a linked list only particular elements can be accessed directly.

:::warning
The **list** data structure in Python is not a linked list. Also Python does not have conventional arrays with a fixed size, fixed size arrays are data structures used in languages such as C and C#, or hidden beneath useful layers of abstraction.
:::

Three variants of linked lists exist:

* Single Linked Lists
* Double Linked Lists
* Circular Linked Lists

## Single Linked Lists

A single linked list consists of *nodes*. These nodes contain an element and a reference to the next node in the list.

![A node consists of an element and a reference to the next node](./assets/node.png)

In Python a node can be defined as follows:

```python
# defines a node in a singly linked list
class _Node:
    # constructs a node with an element and a next node 
    def __init__(self, element, nextNode):
        self.__element = element
        self.__next = nextNode

    # returns the element at the node
    def get(self):
        return self.__element
    
    # returns the next node
    def next(self):
        return self.__next
```

:::tip
The _Node class starts with a underscore to indicate it should not be used outside the scope of a Single Linked List class. When imported from the Python file, symbols starting with an underscore will not be automatically included. This has a good reason. A node is actually part of the implementation of the Single Linked List and when defining the Single Linked List class, no nodes should be exposed to the user of the Single Linked List. An important design principle in programming is to program towards an interface, not an implementation. This way the implementation might change, while the interface remains the same.
:::

### Constructing single linked lists

In a single linked list, the first node is known as the *head*. All other nodes are defined as the *tail*. When traversing through the list to the last node, the last node ends the single linked list with a reference to **None**. This is indicated in the figure with a ground symbol.

![A single linked lists consists of nodes, a head, a tail and ends with None.](./assets/sllist.png)

The Single Linked List class is constructed as follows:

```python
# defines a single linked list
class SingleLinkedList:
    # constructs an empty single linked list
    # or if provided a _Node the single linked list starts with the provided _Node
    def __init__(self, first = None):
        self.__head = first
```

The default first argument in a Single Linked List is **None**. To construct an empty Single Linked List, the constructor is called without providing any arguments:

```python
list = SingleLinkedList()
```

It is important to check if the list is empty before accessing the head element. If the list is empty, head will refer to **None**. Calling any method on **None** will result in an **AttributeError**.

```python
    # returns True if the single linked list does not contain any elements
    def isEmpty(self):
        return self.__head is None
            
    # returns the first element in the singly linked list or None if empty
    def head(self):
        if self.isEmpty():
            return None
        else:
            return self.__head.get()
```

Rather than returning the Node (which should be kept private, don't show any private parts), calling head returns the element or None if the list is empty.

If the head of the single linked list is the first element, then the tail is the rest of the list. The tail of a single linked list is a single linked list by itself.

```python
# returns a single linked list containing all but the first element
    def tail(self):
        if self.isEmpty():
            return SingleLinkedList()
        else:
            return SingleLinkedList(self.__head.next())
```

To prevent an AttributeError when calling tail on an empty list, the method returns an empty single linked list.

### Adding elements to a single linked list

Typically elements are prepended to a single linked list. This means the element is placed before the head element, and becomes the head element of the list itself. The reason to prepend rather than append is that only the head element is accessible.

![Prepending an element to the list](./assets/add-list.png)

In code this requires creating a new node in the single linked list and assigning it to the head property. The only tricky part is that the old head is used as the next reference. Because of precedence in evaluation this can be written in a single line.

```python
    # adds an element at the head of the single linked list
    def prepend(self, element):
        self.__head = _Node(element, self.__head)
        return self
```

In this implementation of the prepend method, the **self** reference is returned. This is actually not really necessary, but it is a nice trick to allow chaining multiple prepends on the same single linked list. An example:

```python
    list = SingleLinkedList()
    list.prepend(3).prepend(2).prepend(1)
```

The opposite of adding elements is removing them. Removing the head element of the list is actually already implemented. Calling the tail method returns a list which does not include the original head element. Note that the original list still remains unchanged.

### Traversing the list

Iterating over the single linked list can be done in two ways: with a loop or recursively.

First let's count the number of elements in the list using a loop.

```python
    #returns the number of elements in the list
    def size(self):
        count = 0
        cursor = self.__head
        while not cursor is None:
            count +=1
            cursor = cursor.next()
        return count
```

Traversing a single linked list with a loop usually requires a cursor, this cursor is updated with the next reference every step of the loop, until it reaches the end of the list.

![Traversing a linked list with a cursor](./assets/traversing-list.png)

It is also possible to write a recursive method to traverse the list.

```python
    #returns the number of elements in the list
    def size(self):
        def count(n, cursor):
            if cursor is None:
                return n
            else:
                return count(n+1, cursor.next())

        return count(0, self.__head)
```

In order to keep the interface of the count method the same, a nested function is used. The nested function *count* has two parameters, (1) the number of counted elements *n* and (2) the *cursor* node. If *cursor* is **None**, the end of the list has been reached and the method can return the number of elements. In the other case the number of elements is incremented and the cursor node becomes the next node. 

Now, only the first call of *count* needs to be constructed. This will bootstrap the recursive function. Calling *count* with initial values 0 and the head of the single linked list, does the trick. Looking closely at both versions of the size method, reveals that both are actually similar. Yet initialization, the stop condition, progressing through the list and the actual operations to calculate the count have been rearranged.

### Analysis of the single linked list

Big-O analysis of the single linked list reveals that most operations are constant time. Except for methods which traverse the list, such as *size*. This is in linear time, which is to be expected.

| Method | Big-O |
| ----- | ----- |
| isEmpty | O(1) |
| head | O(1) |
| tail | O(1) |
| prepend | O(1) |
| traverse | O(n) |

## Double Linked Lists

A double linked list consists of nodes which refer not only to the next but also to the previous node. This can be illustrated as

![A double linked list node](./assets/dll-node.png)

In Python this is written as

```python
class _Node:
    def __init__(self, prevNode, nextNode, element):
        self.__prev = prevNode
        self.__next = nextNode
        self.__element = element

    def get(self):
        return self.__element

    def next(self):
        return self.__next

    def prev(self):
        return self.__prev
    
    def setNext(self, node):
        self.__next = node

    def setPrev(self, node):
        self.__prev = node
```

Note *setNext* and *setPrev* methods, these will be needed when adding and removing nodes.

Whereas in a single linked list, the end of the list was identified by **None**, the double linked list will use two sentinels. Sentinels are special nodes, as they do not contain an element. These sentinels will indicate the front and the back of the double linked list. The front sentinel is called the header and the back sentinel the trailer.

An empty double linked list consists of only its sentinels.

![An empty double linked list](./assets/empty-dll.png)

As a sentinel is a special kind of node, inheritance is used to define a **_Sentinel** class derived from the parent class **_Node**.

```python
class _Sentinel(_Node):
    def __init__(self):
        super().__init__(None, None, None)  
```

:::tip
In Python the parent class is placed between brackets after the declaration of the derived class.

In order to access the parent object **super()** is called.
:::

Through inheritance, **_Sentinel** inherits all attributes and methods from **_Node**. The constructor overwrites the *super* constructor, by calling the parent contstructor, effectively initializing the *prev*, *next* and *element* with **None**.

As the sentinel contains no element, this will remain **None**. If the sentinel is a header then *prev* will also remain **None**. In the case of a trailer, instead of *prev* its *next* will remain **None**.

The *next* of a header and *prev* of a trailer will change, but can only get the correct reference when constructing a double linked list.

### Constructing double linked lists

```python
class DoubleLinkedList:
    def __init__(self):
        self.__header = _Sentinel()
        self.__trailer = _Sentinel()
        self.__header.setNext(self.__trailer)
        self.__trailer.setPrev(self.__header)
```

When constructing the double linked list object, a header and trailer sentinel are made. Then the header will refer to the trailer as *next*, and the trailer will refer to the header as *prev*, as long as the list contains no elements.

Determining whether the double linked list is empty, is by checking if next to the header is the trailer. Note this could also be checked the other way around.

```python
    def isEmpty(self):
        return isinstance(self.__header.next(), _Sentinel)
```

:::tip
The Python built-in function **isinstance** returns True if the first parameter has the type indicated by the second parameter. If not, False.
:::

### Adding elements to a double linked list

Adding elements in a double linked list, can be done from both front and back.

![Double linked list with a single element](./assets/dll-single.png)

Each operation involves setting four references right. As a sentinel is a special kind of node, the difference between a sentinel and a node can be ignored in the operation.

1. The new node has to set its *prev* reference to the previous node.
1. The new node has to set its *next* reference to the next node.
1. The previous node has to update its *next* reference to the new node.
1. The next node has to update its *prev* reference to the new node.

```python
    def addFront(self, element):
        node = _Node(self.__header, self.__header.next(), element)
        self.__header.next().setPrev(node)
        self.__header.setNext(node)
        return self
```

In the *addFront* method a new node is constructed with the header sentinel as its *prev* reference and the old node next to the header sentinel as its *next* reference. Then, the next node, has its *prev* reference updated to the new node. Finally, the header sentinel updates its *next* reference to the new node.

Adding an element to the back is similar, yet the trailer is used to discover the previous node.

### Accessing front and back of a double linked list

The trailer and header sentinel are used to respectively fetch the back and front element. If the list is empty, **None** is returned in order to avoid an AttributeError.

```python
    def front(self):
        if self.isEmpty():
            return None
        return self.__header.next().get()

    def back(self):
        if self.isEmpty():
            return None
        return self.__trailer.prev().get()
```

### Removing elements from a double linked list

Just as elements can be added both to the front and back of a double linked list, they can be removed as well from both directions. It is important to update the *next* of the previous node and the *prev* of the node next node to be deleted.

An example for removing elements from the front:

```python
    def removeFront(self):
        if self.isEmpty():
            return None
        node = self.__header.next()
        self.__header.setNext(node.next())
        node.next().setPrev(self.__header)
        return node.get()
```

To avoid errors, return **None** when the list is empty, otherwise return the element of the deleted node.

Removing the node from the back is similar.

:::tip
Python and more specifically, its reference implementation CPython, is a garbage-collected language. When an object no longer has any references to it, the garbage collector will flag and eventually remove the object.
:::

### Analysis of the double linked list

When compared to the single linked list, the double linked list has the advantage of constant time operations on the back of the list. Its main disadvantage is it requires more memory to store each node. Note that most methods require more operations in a double linked list. When analyzing these with Big-O this is a constant number of operations, so this will be ignored.

| Method | Big-O |
| ----- | ----- |
| isEmpty | O(1) |
| front | O(1) |
| back | O(1) |
| addFront | O(1) |
| addBack | O(1) |
| removeFront | O(1) |
| removeBack | O(1) |
| traverse | O(n) |

## Circular Linked Lists

In a circular linked list, the list does not end. Rather, calling next on the "last" node of a circular linked list, will refer to the "first" node. Instead of a head, the single linked list has a cursor, selecting a node in the list. This cursor can be moved through the list.

![Circular linked list example](./assets/circular-ll.png)

A circular linked list can be implemented:

1. As a single linked list, progressing left to right when calling next.
1. As a double linked list, being able to go left and right from the cursor.
