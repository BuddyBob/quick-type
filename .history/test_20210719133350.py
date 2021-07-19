myStr = '3848202160702781329 2256714569201620911 1074847147244043342'
print(sum(map(int,myStr.split()))/len(myStr.split()))

myStr = '3848202160702781329 2256714569201620911 1074847147244043342'
print(sum(lst := [int(x) for x in myStr.split()]) / len(lst))