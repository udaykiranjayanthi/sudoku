from random import*
grid=[[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]]
lm=grid
def printf(grid):
   for i in range(9):
      for j in range(9):
         print(grid[i][j],end=" ")
      print()
def check(grid):
   for i in range(9):
      for j in range(9):
         if(grid[i][j]==0):
            return i,j
   return 0
def col(a,i,j,k):
   for l in range(9):
      if(a[l][j]==k):
         return 0
   return 1
def row(a,i,j,k):
   for l in range(9):
      if(a[i][l]==k):
         return 0
   return 1
def box(grid,i,j,k):
   for l in range(3):
      for m in range(3):
         if(grid[i+l][j+m]==k):
            return 0
   return 1
def safe(grid,i,j,k):
   if(col(grid,i,j,k) and row(grid,i,j,k) and box(grid,i-(i%3),j-(j%3),k)):
      return 1
   return 0
def solve(grid):
   if(check(grid)==0):
      return grid
   i,j=check(grid)
   x=[]
   while 1:
      k=randint(1,9)
      if k not in x:
         x.append(k)
         if(safe(grid,i,j,k)):
            grid[i][j]=k
            if(solve(grid)):
               return 1
            grid[i][j]=0
      if(len(x)==9):
         break
      
def level(grid):
   board=[[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]]
   x=int(input("\nEnter the number of values in Cell:"))
   points=[]
   c=0
   while 1:
      j=randint(0,8)
      k=randint(0,8)
      index=[j,k]
      if index in points:
         continue
      else:
         points.append(index)
         board[j][k]=grid[j][k]
         c=c+1
      if(c==x):
         break
   printf(board)
   solve(board)
   print("\n")
   printf(board)
      
solve(grid)
printf(grid)
level(grid)

