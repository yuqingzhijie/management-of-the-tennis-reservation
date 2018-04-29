# 网球场地预约管理问题

## How to start

``` bash
# usage
open the test folder, double click index.html
then input your message, you will see the tip
```

##Test

``` bash
# test1
## input:
wqieiwque219312931203
X999 2018-05-08 13:00~13:00 X
X998 2018-05-08 13:00~14:00 X
X997 2018-05-08 17:00~20:00 N
X996 2018-05-08 20:00~22:00 G
X995 2018-05-08 20:00~22:00 H

##output:
Error: the booking is invalid!
Error: the booking is invalid!
Success: the booking is accepted!
Success: the booking is accepted!
Success: the booking is accepted!
Success: the booking is accepted!
income summary:
------
place: X
2018-05-08 13:00~14:00 40yuan
subtotal: 40yuan

place: N
2018-05-08 17:00~20:00 210yuan
subtotal: 210yuan

place: G
2018-05-08 20:00~22:00 140yuan
subtotal: 140yuan

place: H
2018-05-08 20:00~22:00 140yuan
subtotal: 140yuan
------
total: 530yuan


#test2
##input:
X999 2018-05-08 13:00~14:00 X
X997 2018-05-08 15:00~16:00 X
X994 2018-05-08 15:00~16:00 X
X994 2018-05-08 18:00~20:00 X
X994 2018-05-08 18:00~20:00 X Cancel
X994 2018-05-08 18:00~20:00 X Cancel
X992 2018-05-08 18:00~20:00 N
X991 2018-05-08 21:00~22:00 G

##output:
Success: the booking is accepted!
Success: the booking is accepted!
Error: the booking conflicts with existing bookings!
Success: the booking is accepted!
Success: the booking is accepted!
Error: the booking being cancelled does not exist!
Success: the booking is accepted!
Success: the booking is accepted!
income summary:
------
place: X
2018-05-08 13:00~14:00 40yuan
2018-05-08 15:00~16:00 30yuan
2018-05-08 18:00~20:00 126yuan
subtotal: 196yuan

place: N
2018-05-08 18:00~20:00 180yuan
subtotal: 180yuan

place: G
2018-05-08 21:00~22:00 70yuan
subtotal: 70yuan

place: H
subtotal: 0yuan
------
total: 446yuan
```

