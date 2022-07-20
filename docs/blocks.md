This is a reference of all blocks that are currently in [Sandspiel Studio](https://studio.sandspiel.club).<br>
We're still building Sandspiel Studio! To support us, or join our early-access community, please [sign up](https://sandspiel.gumroad.com/l/studio-early-access)! :) 

# Categories
1. [Cells](#Category-Cells)
2. [Comments](#Category-Comments)
3. [Logic](#Category-Logic)
4. [Direction](#Category-Direction)
5. [Number](#Category-Number)
6. [Data](#Category-Data)
7. [Experimental](#Category-Experimental)

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

Am I touching any of these types of cell?<br>
![image](https://user-images.githubusercontent.com/15892272/179988358-aa7b97cb-0c08-4b23-81fb-5b3eb01908fa.png)

_Note: A touching cell can be in any of the 8 surrounding cells:_<br>
🟩🟩🟩<br>
🟩⬜🟩<br>
🟩🟩🟩<br>

## Number Touching
How many cells am I touching that are a certain type?<br>
![image](https://user-images.githubusercontent.com/15892272/179960736-4012156e-3cb9-4b1f-8438-c51b4464d600.png)

How many cells am I touching that are any of these types?<br>
![image](https://user-images.githubusercontent.com/15892272/179988012-b50018b5-ac86-4f60-95fb-9df4032d57a4.png)

_Note: A touching cell can be in any of the 8 surrounding cells:_<br>
🟩🟩🟩<br>
🟩⬜🟩<br>
🟩🟩🟩<br>

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
## Vector
A position or direction.<br>
![image](https://user-images.githubusercontent.com/15892272/179977584-4a32b546-30df-4089-af2c-f1e508dea1c0.png)<br>
![image](https://user-images.githubusercontent.com/15892272/179974554-9d3f1a3e-fc40-4ce2-a683-55c21798ba1b.png)

_Note: These are the vectors that you can choose from._<br>
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

_Note: Behind-the-scenes, vectors are represented with an 'x' and 'y' value.<br>
For example, 'me' is (0,0) and 'NE' is (1,-1)._

## Arrow Keys Direction
The direction that the arrow keys are pressed.<br>
![image](https://user-images.githubusercontent.com/15892272/179979045-6595b375-5fc3-4faa-88de-9668a0f9f63f.png)

_For example: If you press the right arrow, it will be the 'right' direction._

_Note: You can also do diagonal directions by pressing more than one key._<br>
_For example: You press the right arrow and the up arrow, it will be the 'NE' direction._

## Random Transformation
Do something in a random rotation or reflection.<br>
![image](https://user-images.githubusercontent.com/15892272/179988984-ff28b05c-33b1-4ec1-bc61-b7afdf375f02.png)

_For example: Swap positions in a random direction._<br>
![image](https://user-images.githubusercontent.com/15892272/179989174-0827a676-f6d1-4eb2-808e-2b1b166a612f.png)

_Note: 'rotation' picks from eight possible 45° rotations._<br>
_Note: These are all the transformations you can choose from._<br>
```
↻ rotation
✥ reflection
⟷ horizontal reflection
↕ vertical reflection
```

## For Each Transformation
Repeat something in each rotation or reflection.<br>
![image](https://user-images.githubusercontent.com/15892272/179990781-46ef26a8-b249-4227-bb39-38d9ede9a892.png)

_For example: Copy myself in all directions._<br>
![image](https://user-images.githubusercontent.com/15892272/179991164-31aad9ae-5972-44ac-91cd-03e661d57435.png)

_Note: 'rotation' cycles through eight possible 45° rotations._<br>
_Note: These are all the transformations you can choose from._<br>
```
↻ rotation
✥ reflection
⟷ horizontal reflection
↕ vertical reflection
```

## Rotated
Do something, rotated by a certain number of 45° rotations.<br>
![image](https://user-images.githubusercontent.com/15892272/179992323-f8863e6a-9f9e-4f76-a0ca-6fc1e1b0b4e7.png)

_Note: Positive numbers rotate clockwise. Negative numbers rotate anti-clockwise._<br>
_For example: Swap positions with the cell to my left (down rotated by 45° two times, clockwise)._<br>
![image](https://user-images.githubusercontent.com/15892272/179992517-072d2fb7-39e4-486c-a69f-38423c57ea3d.png)

# Category: Number
## Number
A number.<br>
![image](https://user-images.githubusercontent.com/15892272/179995514-53c7e49a-cf52-4a66-8b4b-719a33f27f98.png)

_Note: Can be any number from -100 to 100._

## Operation
A math operation between two numbers.<br>
![image](https://user-images.githubusercontent.com/15892272/179995625-189e0684-f361-4d24-97d1-67ebf69e5a31.png)

_Note: These are all the operations you can do with numbers:_
| Operator | Description | Example | Result |
| :--- | :--- | :--- | :--- |
| + | Add two numbers together | 3 + 2 | 5 |
| - | Subtract a number from another | 5 - 3 | 2 |
| × | Multiply two numbers together | 3 × 2 | 6 |
| ÷ | Divide a number by another | 6 ÷ 2 | 3 |
| % | Find the remainder when you divide one number by another | 5 % 2 | 1 |
| difference | Find the difference between two numbers | 3 difference 5 | 2

You can also do operations with two vectors.<br>
![image](https://user-images.githubusercontent.com/15892272/180000362-04756b4b-447c-46d6-9865-4fb46560c4e1.png)

_Note: When you use two vectors in this block, the operation happens to each co-ordinate._<br>
_For example, if you add 'right' (1, 0) to 'SE' (1, 1), it does (1+1, 0+1). This results in (2, 1)._

You can also combine numbers and vectors in operations.<br>
![image](https://user-images.githubusercontent.com/15892272/180001270-de6118fe-3c49-470e-b3cc-393a4a205e82.png)

_Note: There are some special interactions when you combine numbers and vectors:_<br>
| Operation | Description |
| :--- | :--- |
| Vector + Number | Rotate the vector by a number of 45° rotations, clockwise |
| Vector - Number | Rotate the vector by a number of 45° rotations, anti-clockwise |

_Note: All other number and vector operations apply the number to each co-ordinate of the vector._<br>
_For example: When you multiple 'right' (1, 0) by 2, it does (1×2, 0×2). This results in (2, 0)._

## Random Number
A random number between a minimum and maximum number.<br>
![image](https://user-images.githubusercontent.com/15892272/180003633-ea974ac0-65a7-40f2-8436-951e86f128f7.png)

# Category: Data
All cells store four different pieces of data.
| Name | Description | Range | Default
| :--- | :--- | :--- | :--- |
| Type | How the cell behaves (eg: Sand) | n/a | n/a | 
| Color Fade | How much the cell is faded from its primary color to its secondary color | 0 to 100 | A random number | 
| Hue Rotate | How much the cell's color is changed through the hue wheel. | 0 to 100 (wraps around) | 0 |
| Extra Data | Does nothing | 0 to 100 | 0 |

## Get Data
My data.<br>
![image](https://user-images.githubusercontent.com/15892272/180006996-2393b098-6e49-4cdb-8b51-d4b48e6575bc.png)

When expanded: The data of a cell.<br>
![image](https://user-images.githubusercontent.com/15892272/180007174-69600d1e-00c0-45c6-b2c8-7a70dc67dd68.png)

## Modify Data
Increase my data by a certain amount.<br>
![image](https://user-images.githubusercontent.com/15892272/180007379-0c8291ab-b6f9-4d7b-91ea-7d9232f9b17e.png)

When expanded: Increase the data of a cell by a certain amount.<br>
![image](https://user-images.githubusercontent.com/15892272/180007505-50be8bf2-f320-43d8-b36b-f36adeb5dba5.png)

## Set Data
Set my data.<br>
![image](https://user-images.githubusercontent.com/15892272/180007554-98d71370-11ca-424c-9feb-989dd318c993.png)

When expanded: Set the data of a cell.<br>
![image](https://user-images.githubusercontent.com/15892272/180007659-a2c9a690-9776-4a76-bea0-da9b6df4e239.png)

# Category: Experimental
These are some experimental blocks that have been added recently.

## Repeat
Repeat something a certain number of times.<br>
![image](https://user-images.githubusercontent.com/15892272/180008434-470ca4b0-b734-402f-8d14-f1cf42f43e58.png)

_For example: Swap downwards 2 times._<br>
![image](https://user-images.githubusercontent.com/15892272/180008669-c43b1fb2-2ec9-4ce2-95a0-9217fe7ad70e.png)

## Every
Do something occasionally.<br>
![image](https://user-images.githubusercontent.com/15892272/180009051-54d0ce70-2f1d-4c2d-b099-b36df5d77d14.png)

_For example: Every three frames, swap downwards._<br>
![image](https://user-images.githubusercontent.com/15892272/180009164-ec2ba8de-beaf-424c-a827-d17554835143.png)

## End of Frame
Queue something to happen at the end of the frame (after every cell else has behaved).<br>
![image](https://user-images.githubusercontent.com/15892272/180009378-98fec0ff-7dcd-460a-b748-cd3e532b8e29.png)

_For example: After every cell has behaved, change into Air._<br>
![image](https://user-images.githubusercontent.com/15892272/180009586-f1140776-2df4-455e-bd80-72da32de5354.png)
