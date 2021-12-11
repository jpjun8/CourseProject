# This is the Documentation for the Course Project.

## Table of Contents
* [General info](#general-info)
* [Code Explanation](#code-explanation)
* [Used Software and Module](#used-software-and-module)
* [How to Compile & Run](#how-to-compile--run)
* [Contribution](#contribution)
* [Presentation Link](#presentation-link)

## General info
This project is a web application to search the technical universities depending on the major that a student is looking for.

The majors (subjects) in this application are:
- Computer Science & Information Systems
- Chemical Engineering
- Civil & Structural Engineering
- Electrical & Electronic Engineering
- Mechanical, Aeronautical & Manufacturing Engineering
- Mineral & Mining Engineering
- Petroleum Engineering
- General (Overall) Engineering & Technology (Default)

Most functionalities are implemented under `home.js` and `server.js` that we will explain how main functionalities are implemented in thes two JavaScript files.

## Code Explanation
Because we mainly used `home.js` and `server.js` in this project, we will discuss about them.

### `home.js`
This is the file where the main application is running.

- Constructors
```
this.state = {
    value: '',
    data: null,
    sel: [],
    header: [
        {rank:0, name: "", ..., subject: ""}
    ],
    subjects: [
        { label: "Computer Science & Information Systems"},
        { label: "..."},
        ...
        { label: "..."}
    ]
};
```
These are constructors that are used widely in this application.
`value`: used to grab the input value from *Autocomplete*.
`data`:
- a variable to store the data passed from `server.js`.
- also used to modify `sel` according to user input.
`sel`: a variable to store only universities of *selected* subject.
`header`: a placeholder to form the header for the Table.
`subjects`: options for *Autocomplete* that the user can choose. It can be automatically filled if we want to expand the fields of study to Humanities, Laws, etc.

- `callBackendAPI`
```
    callBackendAPI = async () => {
        const response = await fetch('/read_data');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };
```
`callBackendAPI` fetches the data received from `server.js` with specific route (in this case, `/read_data`) then returns the data itself.

- `componentDidMount()`
```
    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({
                data: res.dataset,
                sel: res.dataset[0] //default
            }, () => {
                console.log(Object.values(this.state.data))
            }))
            .catch(err => console.log(err));
    }
```
`componentDidMount()` runs when the application is loaded.
In this case, it calls `callBackendAPI()` to retrieve the data from `server.js`.
The data are then stored into `data` and `sel` variables.

- `onSelect(event, val)`
```
this.setState({
    value: val
}, () => {
    switch(this.state.value.label) {
        case "Computer Science & Information Systems":
            this.setState({
                sel: this.state.data[1]
            })
            break;
        .
        .
        .
        default:
            this.setState({
                sel: this.state.data[0]
            })
    }
})
```
`onSelect` runs every time the user selects the input in *Autocomplete* bar.
It only runs when the user input matches one of the options in `subjects`, i.e. "Computer Science". Custom value does not work, such as "abcde" or "testing".
It saves the input value (one of the options in `subjects`) into `state.value`.
The `state.sel` is then updated with the corresponding data according to this `state.value`.
For example, when the user selects "Petroleum Engineering", the `state.value` is updated to "Petroleum Engineering". The `state.sel` then stores the corresponding sheet from `state.data`. In this case, the "Petroleum Engineering" xlsx sheet is stored in `state.data[7]`.

- `renderTableData()`
```
    renderTableData() {
        return this.state.sel.map((uni, index) => {
            const {rank, name, loc, academic, employer, citation, H, score, subject} = uni
            return (
                <tr key={name}>
                    <td>{rank}</td>
                    <td>{name}</td>
                    <td>{loc}</td>
                    <td>{academic}</td>
                    <td>{employer}</td>
                    <td>{citation}</td>
                    <td>{H}</td>
                    <td>{score}</td>
                    <td>{subject}</td>
                </tr>
            )
        })
    }
```
`renderTableData()` simply renders the data of universities that the user chooses.
`state.sel` is used as the object to use `map()` underlying information of universities for specific subject.

- `renderTableHeader()`
```
    renderTableHeader() {
        let header = Object.keys(this.state.header[0])
        // console.log(header)
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }
```
`renderTableHeader()` simply creates the header for the table that is rendered from `renderTableData()`.
It utilizes the `state.header` and only takes the *keys* to create the column header.

- `Autocomplete`
```
<Autocomplete
style={{marginLeft: "auto", ...}}
disableClearable
id="combo-box-demo"
options={this.state.subjects}
onChange={this.onSelect}
sx={{ width: 600 }}
renderInput={(params) => <TextField {...params} label="Subject (Default: Overall)" />}>
```
The `Autocomplete` is a module that is imported from `@mui/material` to implement the search bar at the top of the application.
`disableClearable` disables the *X* button to clear off the input.
`options` are the options that the user can choose in the search box.
`onChange` is the function that runs when the user input changes.
`sx` is to style the inner element of the `Autocomplete`.
`renderInput` renders the fields in HTML with the placeholder (label).

### `server.js`
This is the server that is running background to handle the data and send to the main application `home.js`. It can also communicate with `home.js` but in this project, it only sends the data and does not receive except manual input, the dataset.

- `express` and `reader`
```
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const reader = require('xlsx')
const file = reader.readFile('./data/QS_World_University_Rankings_by_Subject_2021_Excel.xlsx')
```
`express` is a node module to host a server in a designated port (port 5000).
`express` also allows to send/receive data to/from the application(s).
`reader` is a node module to read local file such as *xlsx*, *csv*, etc.

- `app.listen()` and `app.get()`
```
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/read_data', (req, res) => {
    ...
    res.send({
        dataset: data
    })
})
```
`app.listen()` links the `express` server to the designated port.
`app.get()` sends the *GET* response to specified route, */read_data*.
In `app.get()`, the data are read, handled, and reformatted to fit the needs from main application, `home.js`.  

## Used Software and Module

### npm and node
All software and components in this project are installed and implemented via `npm (npx)` and `node`.
For example, the initial React application (template) is created via `npx create-react-app course-project`.
The application then runs with `npm start`.
The server also runs with `node server.js`.

### React
The whole project is based on `React` that the project code is a bit different from typical JavaScript since `React` utilizes the `JSX` to make it easier to handle *HTML* and *CSS* in a single JS file.

Functions such as `componentDidMount()` and `callBackendAPI()` are all React built-in implementations that are used to communicate with `server.js` to receive data successfully.

`React` is also compatible with a lot of `node modules` to work with such as `express` and `@mui` (material-ui).

### XLSX
`xlsx` module is solely used to read the data file in xlsx format, in `server.js`.

### Express
`express` module not only allows to host a server on the specified port, but also to parse, reformat, and send data to main application, `home.js`.

### Material-UI
Material-UI, `@mui`, allows to utilize *Autocomplete* to create a dynamic and responsive search bar that is customized to fit the purpose of the project.

## How to Compile & Run
To run this project, `npm` and `node` must be installed in your environment.

- Navigate to the source directory

> cd course-project/src

- Install `npm` modules such as `react`, `express`, etc. just in case that `package.json` is not updated.

> npm install

- Run the server on the background to read data file and send data to the application, `home.js`.

I highly suggest to run this script in another terminal/prompt from the one that is running the next script since `server.js` has to be running while the main application is running.

> node server.js

- Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

> npm start

## Contribution

I am the only member of my team that all materials (project code, written documentation, and presentation) are my original work.

## Presentation Link

The **Software Usage Tutorial Presentation** is included in this repository that you can download it to see.
I added voice overs for each slide to briefly explain the project and screenshots in the presentation that you might need to click the "voice" or "sound" button at the top left of each slide.
