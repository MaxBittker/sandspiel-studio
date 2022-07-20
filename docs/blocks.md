This is a work-in-progress documentation for all the blocks in Sandspiel Studio!

# Categories
1. [Cells](#Category-Cells)
2. [Logic](#Category-Logic)
3. [Direction](#Category-Direction)
4. [Numbers](#Category-Numbers)
5. [Experimental](#Category-Experimental)

# Category: Cell
## Type
A type of cell.<br>
![image](https://user-images.githubusercontent.com/15892272/179949768-49352ac2-d6e3-4f81-9e8b-1d8e67295596.png)

When expanded: A group of types.<br>
![image](https://user-images.githubusercontent.com/15892272/179950548-6e2af8fa-981c-406b-b6b5-d3624b9f28ca.png)

## Swap
Swap places with another cell.<br>
![image](https://user-images.githubusercontent.com/15892272/179951970-d0cba237-889c-4e59-a4ab-104272ed04e3.png)

_Note: This also updates the position of 'me' to be where the cell swapped to._

## Copy
Copy myself into another cell.<br>
![image](https://user-images.githubusercontent.com/15892272/179952575-311567f8-d41a-42fa-addf-6bd65dc33208.png)

## Change
Change a cell into a different type.<br>
![image](https://user-images.githubusercontent.com/15892272/179953946-ee0c78bb-9a75-4e9b-b5f5-199a0e7c6a0e.png)

_Note: This also resets the Hue Rotate, Extra Data, and Color Fade of the cell._

## Check
Is a cell a certain type?<br>
![image](https://user-images.githubusercontent.com/15892272/179955040-31ca74c8-a75c-4556-bace-77af62f7bc89.png)

Is a cell any of these types?<br>
![image](https://user-images.githubusercontent.com/15892272/179958717-16f61604-ca4e-43a9-b3ff-67b0dbb248e2.png)

## Touching
Am I touching a certain type of cell?<br>
![image](https://user-images.githubusercontent.com/15892272/179959271-24aebdac-1005-4793-8243-f2151cc162c9.png)

_Note: A touching cell can be in any of the 8 surrounding cells:_<br>
🟦🟦🟦<br>
🟦⬜🟦<br>
🟦🟦🟦<br>

## Number Touching
How many cells am I touching that are a certain type?<br>
![image](https://user-images.githubusercontent.com/15892272/179960736-4012156e-3cb9-4b1f-8438-c51b4464d600.png)

_Note: A touching cell can be in any of the 8 surrounding cells:_<br>
🟦🟦🟦<br>
🟦⬜🟦<br>
🟦🟦🟦<br>

## Cell Type
The type of a cell.<br>
![image](https://user-images.githubusercontent.com/15892272/179961654-e0166370-89ee-49c2-ab27-37c51a9fda23.png)
