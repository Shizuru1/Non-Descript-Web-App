# Pairing Exercise

This is a multi step pairing exercise.

1. Styling - A styling exercise to change the layout of a page.
2. Counters - A simple React counter application that allows you to manage multiple counters and view their running total.
3. Star Ratings - Create a star rating component
4. Tic Tac Toe - Complete a Tic Tac Toe app

## Getting Started

To run the application, follow these steps:

1. Clone this repository to your local machine
2. Install the project dependencies using `yarn`
3. Start the development server using `yarn start`
4. Open your web browser and go to `http://localhost:3000` to access the React Counter App.

## Instructions

## Styling

Change the layout so it's the holy trinity (HolyGrail.png). You may use CSS or styled components (@emotion/styled)

- Header full width at the top of the page regardless of scroll
- Footer sitting at the bottom of the page regardless of scroll
- Navigation on the left hand side full length of what's remaining between Header and Footer
- Main to fill the surrounding area
- Sidebar on the right hand side of the page

## Counters

1. **Update the Counter Component**

   Update the `Counter` component to accept two callback functions, `onIncrement` and `onDecrement`, as props. Ensure that these callbacks update the counter's values independently.

2. **Render a Fourth Counter**

   Modify the `App` component to render a fourth `Counter` component. Make sure that this new counter's value is updated independently from the other counters when you interact with it.

3. **Create the Total Component**

   Create a new component called `Total`. This component should display below the `Counter` components and always display the running total of all the counter values. You can compute the total by summing the values from the state.

4. **Changing implementations**

   Remove the onIncrement and onDecrement props from the Counter component
   Remove the value and data from App.
   Change each counter to maintain it's own individual state
   Change total so it will work
   Ensure all Counter components still update and function independently after this change.

## Star Rating

**Create a star rating widget**

- The widget accepts two parameters: the maximum number of stars and the number of currently filled stars.
- When a star is clicked, it is filled along with all the stars to its left.
- When the user hovers over the stars, all the stars under the cursor and its left are filled.
- The stars which need to be filled during hover take priority over existing filled state.
- If the cursor leaves the widget and no new selection is made, the appropriate stars revert to the filled state before the hovering.
- Make the star rating widget reusable such that multiple instances can be rendered within the same page.

## Tic Tac Toe

**Build a tic tac toe game**

- Players can take turns to place an X or a O on the board.
- A player wins if three of their marks are in a horizontal, vertical, or diagonal row.
- Display the current game status at the top: whose turn it is, winner (if any), or draw.
- A player may not overwrite an existing square
