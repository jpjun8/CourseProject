// This is the backend (server)

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Requiring the xlsx module
const reader = require('xlsx')

// Reading our dataset
const file = reader.readFile('./data/QS_World_University_Rankings_by_Subject_2021_Excel.xlsx')

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/read_data', (req, res) => {
    let data = []
    
    function Uni(rank, name, loc, academic, employer, citation, H, score, subject) {
        this.rank = rank;
        this.name = name;
        this.loc = loc;
        this.academic = academic;
        this.employer = employer;
        this.citation = citation;
        this.H = H;
        this.score = score;
        this.subject = subject;
    }

    for(let i = 13; i < 21; i++) { 
        let ar = [] // array of universities in current sheet
        let deet = [] // restructured array of Uni objects with info

        // sheets[13]: Engineering, sheets[14~20]: Subjects
        const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]]
        )
        temp.forEach((res) => {
            ar.push(res)
        })

        ar.splice(0, 9); // removing irrelevant rows
        const arr = ar.filter(val => val[Object.keys(val)[0]] !== '');

        arr.forEach((res) => {
            let flag = Object.keys(res).length
            let s = ""
            switch(i) {
                case 13:
                    s = "Engineering & Technology"
                    break;
                case 14:
                    s = "Computer Science & Information Systems"
                    break;
                case 15:
                    s = "Chemical Engineering"
                    break;
                case 16:
                    s = "Civil & Structural Engineering"
                    break;
                case 17:
                    s = "Electrical & Electronic Engineering"
                    break;
                case 18:
                    s = "Mechanical, Aeronautical & Manufacturing Engineering"
                    break;
                case 19:
                    s = "Mineral & Mining Engineering"
                    break;
                case 20:
                    s = "Petroleum Engineering"
                    break;
                default:
                    s = "DEFAULT"
            }

            if(flag == 8) {
                const entry = new Uni(
                    res[Object.keys(res)[0]],
                    res[Object.keys(res)[1]],
                    res[Object.keys(res)[2]],
                    res[Object.keys(res)[3]],
                    res[Object.keys(res)[4]],
                    res[Object.keys(res)[5]],
                    res[Object.keys(res)[6]],
                    res[Object.keys(res)[7]],
                    s
                );
                deet.push(entry);
            } else if(flag == 9) {
                const entry = new Uni(
                    res[Object.keys(res)[0]],
                    res[Object.keys(res)[2]],
                    res[Object.keys(res)[3]],
                    res[Object.keys(res)[4]],
                    res[Object.keys(res)[5]],
                    res[Object.keys(res)[6]],
                    res[Object.keys(res)[7]],
                    res[Object.keys(res)[8]],
                    s
                );
                deet.push(entry);
            }
        });

        // console.log(deet);
        data.push(deet)
        // console.log(data);
    }

    // data[0]: Engineering & Technology
    // data[1]: Computer Science & Information Systems
    // ...
    // data[7]: Petroleum Engineering

    res.send({
        dataset: data,
    })
});