import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Button, Dropdown, Header, Icon, Pagination, Popup, Segment,Label} from 'semantic-ui-react';
import {connect} from 'react-redux';
import OneStar from '../../assets/onestar.png'
import TwoStar from '../../assets/twostar.png'
import ThreeStar from '../../assets/threestar.png'
import {Link} from 'react-router-dom'
import * as userActions from '../../actions/userActions';
import Loading from "../Loading";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

class AllArticles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            events: [],
            events2:[],
            shown:[],
            shownPage:1,
            totalNumOfEvents:0,
            eventPerPage:8,
            dateDir:false,
            impDir:false,
            dropdownItems:[],
            dropdown2Items:[],
            dropdown3Items:[
                {key:1,value:1,text:"1",image:OneStar},
                {key:2,value:2,text:"2",image:TwoStar},
                {key:3,value:3,text:"3",image:ThreeStar}
            ],
            drTitle:[],
            drAuthor:[],
            loading:false,
            startDate:new Date(),
            endDate:new Date()



        }


    }

    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getArticles();
        this.setShownEvents();
        this.sortEventsByDate();
        await this.setInitialDates();

    }
    setInitialDates=async ()=>{
        let {0 : a ,length : l, [l - 1] : b} = this.state.events2;

        await this.setState({startDate:new Date(b.date.toString()),endDate:new Date(a.date.toString())});
    };

    getTitlesForDropdown=()=>{
        let dropdownItems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            for(let j of dropdownItems){
                if(j.value.trim()===i.title.trim()){
                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,
                    text:i.title,
                    value:i.title

                };
                dropdownItems.push(newitem);
                key++;
            }
        }
        dropdownItems.sort((a,b)=>{
            return ('' + a.value).localeCompare(b.value);
        });
        this.setState({titleItems:dropdownItems});
    };
    getAuthorsForDropdown=()=>{
        let dropdownItems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            let author=i.username+" "+i.usersurname;
            for(let j of dropdownItems){
                if(j.value.trim()===author.trim()){
                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,
                    text:author,
                    value:author

                };
                dropdownItems.push(newitem);
                key++;
            }
        }
        dropdownItems.sort((a,b)=>{
            return ('' + a.value).localeCompare(b.value);
        });
        this.setState({authorItems:dropdownItems});
    };

    setShownEvents(){

        let arr=this.state.events2.slice((this.state.shownPage-1)*this.state.eventPerPage,(this.state.shownPage)*this.state.eventPerPage);

        this.setState({shown:arr});

    }

    async getArticles(){

        this.setState({loading:true});
        await this.props.articles("?page=1&limit=1").then(result=>{
            let a=result.value.totalNumberOfArticles;
            this.setState({totalNumOfEvents:a,numPages:Math.floor((a-1)/this.state.eventPerPage)+1});
           return a;
        }).then(async(a)=> {

            await this.props.articles("?page=1&limit=" + a).then(result => {

                this.setState({events: result.value.articles});
            }).then(async()=>{
                this.updateDates();
               // await this.getAuthors()
            }).then(()=>{

                this.setState({events2:this.state.events});
                this.getTitlesForDropdown();
                this.getAuthorsForDropdown();
                this.setState({loading:false});
            })
        });
    }

    /*
    async getAuthors(){

        for (let i of this.state.events) {
            await this.props.authors("/"+i.userId).then(res=>{
                i.author=res.value.user.name + " " + res.value.user.surname;

            })

        }
    }

     */

    sortfunc=(f,g)=>{
        let dateDir=this.state.dateDir;
        let a=new Date(f.normalDate);
        let b=new Date(g.normalDate);
        let c=f.Importance;
        let d=g.Importance;
        if(a.getTime()===b.getTime()) {
            return d-c;
        }
        return dateDir?a-b:b-a;

    };

    sortEventsByDate=()=>{
        let dateDir=this.state.dateDir;
        let newevents=this.state.events2;
        let newevents2=this.state.events;
        newevents.sort( this.sortfunc);
        newevents2.sort( this.sortfunc);

        this.setState({events:newevents2});
        this.setState({events2:newevents});
        this.setState({dateDir: 1-dateDir});
        this.setState({impDir:false});
        this.setState({shownPage:1},this.setShownEvents);

    };

    updateDates(){

        let newevents=this.state.events.slice();

        let i;
        for(i=0;i<newevents.length;i++) {
            let d=newevents[i].date;
            newevents[i].normalDate=normalizeDate(d);
        }
        this.setState({events:newevents});

    }

    updatePage= (e,data)=>{
        this.setState({shownPage:data.activePage},this.setShownEvents);
    };

    onDropdownsChange=async()=>{
        let list=[];
        let value1=this.state.drTitle;
        let value2=this.state.drAuthor;
        let empty1 = value1.length === 0;
        let empty2 = value2.length === 0;
        for (let i of this.state.events) {
            let date=new Date(i.normalDate);

            if ((value1.includes(i.title) || empty1) && (value2.includes(i.author) || empty2)//&&(value3.includes(i.Importance)||empty3)
                &&(compareDates(this.state.startDate,date)&&compareDates(date,this.state.endDate))

            ) {
                list.push(i);
            }
        }

        this.setState({events2:list},()=>{this.setState(
            {shownPage:1},this.setShownEvents);
            this.setState({numPages:Math.floor((this.state.events2.length-1)/this.state.eventPerPage)+1})
        })

    };



    onTitleChange=async(e,{value})=>{
        this.setState({drTitle:value},this.onDropdownsChange);

    };
    onAuthorChange=async(e,{value})=>{
        this.setState({drAuthor:value},this.onDropdownsChange);


    };


    startDateChange=(date)=>{
        this.setState({startDate:date},this.onDropdownsChange);

    };

    endDateChange=(date)=>{
        this.setState({endDate:date},this.onDropdownsChange);
    };

    render() {
        const {shown}  = this.state;
        //const len=shown.length;
        const loading=this.state.loading;

        return (

            !loading?(

                <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                    <Segment  raised piled padded compact textAlign='left'>
                        <Header textAlign='center'>
                            Articles

                        </Header>
                        <table className="ui blue table fixed">
                            <thead>
                            <tr>
                                <th>
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>

                                        Article

                                        <Dropdown
                                            style={{marginLeft:5}}
                                            placeholder='All'

                                            multiple
                                            search
                                            selection
                                            options={this.state.titleItems}
                                            onChange={this.onTitleChange}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>

                                        Author

                                        <Dropdown
                                            style={{marginLeft:5}}
                                            placeholder='All'

                                            multiple
                                            search
                                            selection
                                            options={this.state.authorItems}
                                            onChange={this.onAuthorChange}
                                        />

                                    </div>

                                </th>
                                <th>
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>

                                        Date
                                        <Button.Group style={{marginLeft:6,marginRight:20}}>
                                            <Button onClick={this.sortEventsByDate}>
                                                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>

                                                    {this.state.dateDir?
                                                        (<Icon name={"angle down"}/>):(<Icon name={"angle up"}/>)
                                                    }

                                                </div>
                                            </Button>


                                            <Popup trigger={
                                                <Button>
                                                    <Icon name={"filter"}/>
                                                </Button>
                                            } flowing hoverable>
                                                <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginLeft:5}}>

                                                    <DatePicker
                                                        selected={this.state.startDate}
                                                        onChange={this.startDateChange}
                                                    />
                                                    to
                                                    <DatePicker
                                                        selected={this.state.endDate}
                                                        onChange={this.endDateChange}
                                                    />
                                                </div>
                                            </Popup>
                                        </Button.Group>
                                    </div>

                                </th>

                                <th>
                                        Rating

                                </th>

                            </tr>
                            </thead>
                            <tbody>
                            {shown.map(function(article) {

                                return(
                                    <tr>
                                        <td>
                                            <Link to={"/articles/"+article._id}>{article.title}</Link>
                                        </td>
                                        <td>
                                            <Link to={"/profile/"+article.userId}>{article.username+" "+article.usersurname}</Link>

                                        </td>
                                        <td>
                                            {article.normalDate}
                                        </td>
                                        <td>
                                            <div style={{display:"flex",flexDirection:"row"}}>
                                            <Label color={"yellow"} >
                                                {article.rateAverage}
                                            </Label>
                                            <Label>
                                            <Icon name='users' />
                                                {article.numberOfRates}
                                            </Label>
                                            </div>
                                        </td>

                                    </tr>)
                            })}
                            </tbody>


                        </table>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                            <Pagination  defaultActivePage={1}
                                         siblingRange={5}
                                         totalPages={this.state.numPages}
                                         activePage={this.state.shownPage}
                                         onPageChange={this.updatePage}
                            />
                        </div>

                    </Segment>

                </div>
            ):(<Loading/>)


        )
    }
}

const dispatchToProps = dispatch => {
    return {
        articles: params => dispatch(userActions.getAllArticles(params)),
        authors:params=>dispatch(userActions.profile(params))
    };
};

export function normalizeDate(date){

    const dat = new Date(date);
    const formatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return dat.toLocaleDateString('en-US', formatOptions);
}
export function compareDates(a,b) { //date a <= date b
    let c=a.getFullYear();
    let d=b.getFullYear();

    let m1=a.getMonth();
    let m2=b.getMonth();
    let d1=a.getDate();
    let d2=b.getDate();


    if(c>d) {

        return false;
    }
    else if(c===d){

        if(m1>m2)
            return false;
        else if(m1===m2){
            if(d1>d2)
                return false;
        }
    }
    return true;


}
export default connect(null, dispatchToProps)(AllArticles);

