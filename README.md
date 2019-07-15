<h1> Countdown - mod3 project </h1> 

<p> This project was made during module 3 at Flatiron School. The project specs were to build something using
javascript with a ruby backend. This was a solo project made in 4 days and presented to the office on the last day.</p>

<p> This project is a recreation of the gameshow Countdown from TV, specifically the Math section. The game involves contestants picking 6 numbers from either low or high piles and then performing math operators on them to reach a randomly targeted number, within 30 seconds. </p>

<h3> Prerequisites </h3> 

<p> You can view and interact with this program by doing the following: </p>
<ul>
  <li> Press the clone or download button in the level above this repo</li>
  <li> Copy the text underneath where you just clicked or click the notepad with an arrow</li>
  <li> Navigate in your terminal to where you would like the project stored</li>
  <li> Type in 'git clone' + paste in the above and press enter</li>
  <li> cd into the folder you just made and open it in a text editor (the command code . for vscode)</li>
  <li> cd into the frontend folder </li>
  <li> Type 'open index.html' to see and interact with the program </li> 
 </ul>

<h3> Built With </h3>

<p> It was a requirement to only build this with javascript for the front end </p>
<p> The back end is made with Ruby on Rails </p>

<h3> Author </h3>

<p> Danny Wakeling </p>
<a href="https://github.com/dwake5">Github</a>
<a href="https://www.linkedin.com/in/danny-wakeling1/">Linkedin</a>

<h3> Features and code </h3>

<p> During this project I learnt a lot about manipulating the DOM and javascript as a whole. It involved a fair amount of math, which I enjoy and excel at, coming from a mathematical background. </p> 
<p> Specifically it was a challenge to ensure the user could only click the usable buttons at the right time. Which has been implemented and more so that they could not concatenate numbers. For example 1 + 1 can not equal 11, this sounds as easy as only allowing the input of numbers to go number, operator, repeat. But this is not the case as many operators, namely brackets, can be input multiple at a time. <p> 
<p> I involved scoring into the game, which the TV show does not. This is intended to allow user highscores in future based on how well they do over a number of rounds, scoring is based on how far away they get from the target in the alloted time. </p>
<p> In user testing I noticed that some people quickly got reached the target score perfectly and then were left only to wait till the timer finished, so added in some code which would drop the timer to 1 second if this occured. </p>
<p> I added in a 'best score yet' feature, which keeps track of the closest someone has got to the target and uses this as there result. This benefits the player as they can reach a close score and then remove there numbers and go for a better one without having to remember it. The progmattical difficulty in this was having to use Math.abs(to deal with the user going over the target number whilst still being closer). It now works perfectly. </p> 

<h3> Stretch goals </h3>

<p> CSS is not yet done, it is aimed to make it look like the gameshow. </p>
<p> A button to allow the user to finishthe current round when they belive they have got the best score they can. <p>
<p> Post score to the backend. </p>
<p> A button to clear all there inputs. </p>
