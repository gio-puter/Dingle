# Dingle
## History
Dingle is a word game that I brainstormed and created in Python while on my 2022 spring break at Boston College.
I shelved it, until the summer of 2023, since I struggled to convert my Python code to JavaScript and look pretty with HTML and CSS.
However, I eventually figured it out.
The retro-terminal look produced by the CSS file was something I wanted to create since I wrote the original game on Replit which has that look in its console.
But, I was actually able to create it with a lot of help from the source code of the 'rataalada' website that was created when 'The Batman' was released. (You can the Wayback Machine to take a look).
But, there's still more that I want to do with this game.

## How to play
As you can probably tell, Dingle is heavily inspired by Wordle from its name to its goal.
However, the caveat here is that a guess only informs you if the secret word has similar letter(s), instead of the position and which letter is similar.
For example, if the secret word is "caveat" and you guess "apples," the game would return "2" since there are 2 similar letters between the two words — 'a' and 'e.'
Similar to Wordle, the guess must match the length of the secret word, which in this case is 6 letters.
There are no limits ot the amount of guesses, but obviously you want to get it done in as few as possible.

(P.S. it is advisable to get a little notepad or something since it can be easy to lose track of eliminated and guaranteed letters)

## How it works
All the secret words are listed, in the order of their use, in an array in the 'sixletterwords.js' file.
The word is chosen and updated every day based on the time.
Each guess is checked for existence using an API and length otherwise an error message is printed out for the user.
All valid guesses and progress is saved to localStorage so that we can limit 'cheaters' and whatnot.
A win is recorded when the guess is correct and is tallied in localStorage.
Other stats are saved in localStorage so that we can show them all when the user eventually wins.

## To Add-on/Contribute
First and foremost, any contributions and/or ideas are welcome.
Just because an idea is here does NOT mean that you HAVE to do ALL of it.
Do what you can and are able to do.

1) Currently, the game only works with 6 letter guesses and secret words. I have already added arrays of four and five letter words. So, if possible, there should be a way on the webpage to switch between 4, 5, and 6 letter words whether it be through tabs or staged as EASY, MEDIUM, HARD. This would also require some additions to the localStorage dictionary.
2) I think it would be cool to add some sort of leaderboard system whether its global or among friends.
3) It might not be glamorous, but some of this code could definitely use some cleaning up. Any optimization would be greatly appreciated.
4) Also not glamorous, but I haven't checked that all the words in the arrays are valid. So going through them and removing the bad ones would be great. And also removing ones that aren't reasonable to ask a normal person to know.
5) Any ideas and extensions that you might have, I'd love to hear.


Thank you

\- Gio
#
