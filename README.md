# Givebutter Frontend Take-home

## Overview

Our goal is to fix and enhance a Pokedex application. If you are unfamiliar with the world of Pokemon, here is a brief explanation:

> The Pokedex is an electronic device created and designed to catalog and provide information regarding the various species of Pokemon featured in the Pokemon video game, anime and manga series.
 
[Source](https://pokemon.fandom.com/wiki/Pokedex)
 
Our version of the Pokedex is able to list and search through Pokemon. However, our search is a bit buggy. Additionally, we want to add a feature that shows a selected Pokemon's details like its **type**, **moves**, and **evolution chain**.

Your time is valuable, and we are extremely appreciative of you participating in this assessment. We're looking to gauge your ability to read and edit code, understand instructions, and deliver features, just as you would during your typical day-to-day work. We expect this test to take no more than one to two hours and ask to complete this work within the next two days. Upon submit, we will review and provide feedback to you regardless of our decision to continue the process.

Please update and add code in `App.js` and `index.css` based on the requirements found below. Additionally, we ask you to edit the `readme.md` with answers to a few questions found in the `Follow-up Questions` section also found below.

When you are finished, please upload your completed work to your Github and invite `@gperl27` to view it. **Do not open a PR please.**

## Setup

- This repo was scaffolded using `create-react-app`. As such, this app requires a stable version of `node` to get up and running.
- Clone this repo and run `npm install`.
- To run the app, run `npm start`.
- Please reach out to the Givebutter team if you have any issues with the initial setup or have any problems when running the initial app.

## Requirements

### Search
- Typing in the search input should filter the existing Pokemon list and render only matches found
- Fix any bugs that prevent the search functionality from working correctly
- If there are no results from search, render "No Results Found"
- The search results container should be scrollable
- The UI should match the below mockup

![](mockup0.png)

### Details Card
     
- Clicking "Get Details" for any given Pokemon should render a card that has the Pokemon's `name`, `types`, `moves`, and `evolution chain`
- Use the api functions defined in `api.js` to retrieve this data. Adding new endpoints or editing existing ones are out of scope
- The details card should match the below mockup

![](mockup1.png)

## Follow-up Questions

Please take some time to answer the following questions. Your answers should go directly in this `readme`.

- Given more time, what would you suggest for improving the performance of this app?

If I was given more time, I would consider a few things, how large can the dataset get? How often it will increase?, how many users will be using this app at once? I would then implement SWR which is a cache invalidation strategy. I would create a useRequest hook that utilizes swr to cache the data on every request. This would greatly improve data fetching speed. Another thing I would consider is adding pagination. Because the orignal data set can get very large, its important to setup up a batch fetch process instead of fetching all pokemon at once. Depending on how many users will be using this app, we could also consider setting up a load balancer for better distibution of resources when deployed to a server. Finally, I would setup some sort of authentication process to prevent ddos attacks or unwanted use of our endpoints. This will allow us to ensure our apis are not being overloaded by bots, unwanted users etc. 

- Is there anything you would consider doing if we were to go live with this app?
The main thing I would consider if going live is using SSR or server actions via (next.js) or creating some sort of middleware/backend so that requests are not coming directly from the client. Depending on the usecase for this app, its a big security vulnerability to make API requests directly from the client side. I would also definitely add some sort of authentication process both at the client and middleware level. Resource and api costs can get very expensive if we dont have any sort of system to prevent unwanted users. I would implement styled-components because I think it makes writing/reading css alot easier. I would of course also make the UI look more like a pokedex. I would also fix all the node package vulnerabilities. This can be a big security risk as well. Some other things I would consider is where we will be hosting this app, cloud hosting costs vary by platform so its important to choose a platform that is both cost effective and has the proper resource allocation.

- What was the most challenging aspect of this work for you (if at all)?
I honestly had a blast building this out (I used to be a huge pokemon fan and always wanted a real pokedex). The only particular challenge was figuring out the Evo Chain because it took me a while to understand the API sequence. At first I thought the pokemon list index was the id, but then after digging deeper I learned that the evo ID is derrived from the fetchSpecies response. I had to reference the poke api docs to fully understand where to find everything in the data. The second challenging aspect was optimizing everything to prevent unwanted useStates  or useEffects. I utilized useMemo and useCallback as a forthought incase we would have nested child componenets in the future to modularize alot of the code in app.js
