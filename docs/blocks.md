This is a work-in-progress documentation for all the blocks in Sandspiel Studio!

# Categories
1. [Cells](#Category-Cells)
2. [Comments](#Category-Comments)
3. [Logic](#Category-Logic)
4. [Direction](#Category-Direction)
5. [Numbers](#Category-Numbers)
6. [Experimental](#Category-Experimental)

# Category: Cells
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

# Category: Comments
## Note
A note about your code.<br>
![image](https://user-images.githubusercontent.com/15892272/179962160-aa02fbff-b2fc-42ba-aee5-36b096e4751f.png)

# Category: Logic
## If
If a condition is true, do something.<br>
![image](https://user-images.githubusercontent.com/15892272/179962241-90993dee-17fd-4f77-828d-11fdc393d6f2.png)

_For example: If I am touching Water, change into Water._<br>
![image](https://user-images.githubusercontent.com/15892272/179962655-d5a89dc0-53b5-4b24-9ad5-3bc9d2be7be8.png)

## Chance
Randomly true with a certain chance.<br>
![image](https://user-images.githubusercontent.com/15892272/179969142-e4448058-4e2e-4515-8214-d6c22f090b1a.png)

## Keyboard
Is a keyboard button held down?<br>
![image](https://user-images.githubusercontent.com/15892272/179969257-80b78cd4-3935-4412-86fd-bd2ec1c4161f.png)

_Note: You can choose from any of these keys._<br>
```
space bar
➡ right arrow
⬅ left arrow
⬆ up arrow
⬇ down arrow
```

## Compare
Is a value equal to another value?<br>
![image](https://user-images.githubusercontent.com/15892272/179971002-508b6dd5-2601-4fc8-bae2-52e92599b601.png)

Is a value bigger/smaller than another value?<br>
![image](https://user-images.githubusercontent.com/15892272/179971049-5e149061-1ba3-408a-b3f0-0cdb86ca6d48.png)<br>
![image](https://user-images.githubusercontent.com/15892272/179971090-b7564fd7-b845-42d6-99ad-64fba9c80030.png)

_For example: Am I touching more than 3 Water cells?_<br>
![image](https://user-images.githubusercontent.com/15892272/179971421-438eba25-0494-4ff8-a0af-05124f0f91ae.png)

## And / Or
Are both things true?<br>
![image](https://user-images.githubusercontent.com/15892272/179971839-9dd198e7-3695-4746-9cdb-c19c07e9d91a.png)

Is either thing true?<br>
![image](https://user-images.githubusercontent.com/15892272/179971893-9d4a1fb1-ff4e-4a6f-b0fc-42e3a677d20b.png)

_For example: Am I touching Water, and above Sand?_<br>
![image](https://user-images.githubusercontent.com/15892272/179972322-0ef7244d-e4fd-4b9f-b8b4-9177cc911a94.png)

## True / False
True.<br>
![image](https://user-images.githubusercontent.com/15892272/179972620-3fc56fc8-2f68-4700-aa91-036caab39a13.png)

False (not true).<br>
![image](https://user-images.githubusercontent.com/15892272/179972654-bfa91b19-18bf-40fd-b010-ce7be18447ae.png)

## Not
Is a thing not true?<br>
![image](https://user-images.githubusercontent.com/15892272/179972817-f3cf462d-ae37-4e9d-aae9-0dab4d0f2cee.png)

_For example: Am I not touching Water?_<br>
![image](https://user-images.githubusercontent.com/15892272/179973645-0433cc0f-9c3e-431e-bf45-d94e26620e77.png)

# Category: Direction
## Position / Direction
A position or direction (this block is used for both).<br>
![image](https://user-images.githubusercontent.com/15892272/179977584-4a32b546-30df-4089-af2c-f1e508dea1c0.png)<br>
![image](https://user-images.githubusercontent.com/15892272/179974554-9d3f1a3e-fc40-4ce2-a683-55c21798ba1b.png)

_Note: These are the directions that you can choose from._<br>
```
me
➡ right
⬅ left
⬆ up
⬇ down
↗ NE
↘ SE
↙ SW
↖ NW
? Neighbor
Arrow Keys_
```

_Note: 'me' is the position of this cell._<br>
_Note: '? Neighbor' chooses a random direction._<br>
_Note: 'Arrow Keys' direction is controlled by what arrow keys you are pressing._

_Note: Behind-the-scenes, positions and directions are represented with an 'x' and 'y' value.<br>
For example, 'me' is (0,0) and 'NE' is (1,-1)._

## Arrow Keys Direction
The direction that the arrow keys are pressed.<br>
![image](https://user-images.githubusercontent.com/15892272/179979045-6595b375-5fc3-4faa-88de-9668a0f9f63f.png)

_For example: If you press the right arrow, it will be the 'right' direction._

_Note: You can also do diagonal directions by pressing more than one key._<br>
_For example: You press the right arrow and the up arrow, it will be the 'NE' direction._
