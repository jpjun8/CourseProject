import * as React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            data: null,
            sel: [],
            header: [ //placeholder
                {rank: 0, name: "", location: "", academic: 0, employer: 0, citation: 0, H: 0, score: 0, subject: ""}
            ],
            subjects: [
                { label: "Computer Science & Information Systems"},
                { label: "Chemical Engineering"},
                { label: "Civil & Structural Engineering"},
                { label: "Electrical & Electronic Engineering"},
                { label: "Mechanical & Aeronautical & Manufacturing Engineering"},
                { label: "Mineral & Mining Engineering"},
                { label: "Petroleum Engineering"},
                { label: "General Engineering & Technology"}
            ]
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

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

    callBackendAPI = async () => {
        const response = await fetch('/read_data');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };

    handleSelect = (e) => {
        // console.log(e);
        this.setState({
            value: e
        });

        switch(e) {
            case "Computer Science":
                // console.log(this.state.data[1])
                this.setState({
                    sel: this.state.data[1]
                }, () => {
                    console.log(this.state.sel)
                    // const elem = document.getElementById("p1");
                    // elem.innerHTML = this.state.sel[0].H // rank 1's H value
                });
                break;
            case "Chemical":
                this.setState({
                    sel: this.state.data[2]
                });
                break;
            case "Civil & Structural":
                this.setState({
                    sel: this.state.data[3]
                });
                break;
            case "Electrical & Electronic":
                this.setState({
                    sel: this.state.data[4]
                });
                break;
            case "Mechanical, Aeronautical & Manufacturing":
                this.setState({
                    sel: this.state.data[5]
                });
                break;
            case "Mineral & Mining":
                this.setState({
                    sel: this.state.data[6]
                });
                break;
            case "Petroleum":
                this.setState({
                    sel: this.state.data[7]
                });
                break;
            default:
                this.setState({
                    sel: this.state.data[0]
                });
        }   
    }

    onSelect = (event, val) => {
        console.log(event, val);

        this.setState({
            value: val
        }, () => {
            switch(this.state.value.label) {
                case "Computer Science & Information Systems":
                    this.setState({
                        sel: this.state.data[1]
                    }, () => {
                        console.log(this.state.sel)
                    })
                    break;
                case "Chemical Engineering":
                    this.setState({
                        sel: this.state.data[2]
                    })
                    break;
                case "Civil & Structural Engineering":
                    this.setState({
                        sel: this.state.data[3]
                    })
                    break;
                case "Electrical & Electronic Engineering":
                    this.setState({
                        sel: this.state.data[4]
                    })
                    break;
                case "Mechanical, Aeronautical & Manufacturing Engineering":
                    this.setState({
                        sel: this.state.data[5]
                    })
                    break;
                case "Mineral & Mining Engineering":
                    this.setState({
                        sel: this.state.data[6]
                    })
                    break;
                case "Petroleum Engineering":
                    this.setState({
                        sel: this.state.data[7]
                    })
                    break;
                default:
                    this.setState({
                        sel: this.state.data[0]
                    })
            }
        })

        // switch(val) {
        //     case "Computer Science & Information Systems":
        //         this.setState({
        //             sel: this.state.data[1]
        //         }, () => {
        //             console.log(this.state.sel)
        //         })
        // }
    }

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

    renderTableHeader() {
        let header = Object.keys(this.state.header[0])
        // console.log(header)
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div className="Home">
                <div>
                    <h1 id="title"><b>University Ranking by Subject in <i>Engineering & Technology</i></b></h1>
                    <div id="wrapper">
                        <Autocomplete
                        style={{marginLeft: "auto", marginRight: "auto", paddingBottom: 10}}
                        disableClearable
                        id="combo-box-demo"
                        options={this.state.subjects}
                        onChange={this.onSelect}
                        sx={{ width: 600 }}
                        renderInput={(params) => <TextField {...params} label="Subject (Default: Overall)" />}
                        />
                    </div>
                    <table id="unis">
                        <tbody>
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Home;