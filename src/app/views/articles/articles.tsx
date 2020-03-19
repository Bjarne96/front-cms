import * as React from 'react';
import autobind from "autobind-decorator";
import { Loader, Button } from 'semantic-ui-react';

import { articleWebSchema as Schema, IArticle, emptyWebArticle as defaultArticle } from "./../../../schemas"
import { FormModal } from "../../components/modal/formModal"
import { getArticles, updateArticle, insertArticle, deleteArticle } from '../../handler/articleRequests'
import { DataTable as Table } from '../../components/table/table'
import DialogModal from '../../components/modal/dialogModal';
import './articles.css';

interface IState {
    loading: boolean;
    //Rendering a specific modal depends on this state
    openModal: "edit" | "delete" | "new" | "";
    //Articles array to pass data to table component
    articles: Array<IArticle>;
    //Article to pass data to modal
    article: IArticle;
}



export class Articles extends React.Component <{}, IState>{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            openModal: "",
            articles: [],
            article: defaultArticle
        }
    }

    //Loads all articles and adds them into the state
    async loadArticles() { 
        this.setState({loading: true});
        let articles = await getArticles()
        this.setState({articles: articles.result, loading: false})
    }

    //Render first and loads articles afterwards
    componentDidMount() {
        this.loadArticles();
    }

    render() {
        //Loader while executing other stuff
        if(this.state.loading) return <Loader active />
        return <>
            {this.state.openModal === "delete" ?
                //Modal for deleting a article
                <DialogModal 
                    closeModal={this.closeDeleteForm} 
                    content={JSON.stringify(this.state.article.name)} 
                    dataRow={this.state.article}
                /> 
            : ""}
            {this.state.openModal === "edit" ?
                //Modal for editing a article
                <FormModal 
                    Schema={Schema} 
                    closeModal={this.closeEditForm} 
                    dataRow={this.state.article}
                    size={"fullscreen"}
                /> 
            : ""}
            {this.state.openModal === "new" ? 
                //Modal for creating a new article
                <FormModal 
                    Schema={Schema} 
                    closeModal={this.closeNewForm} 
                    dataRow={this.state.article}
                    size={"fullscreen"}
                /> 
            : ""}
            <Button
                onClick={() => this.loadArticles()}  
                icon='recycle' 
                content='Refresh'              
            />
            <Button
                onClick={() => this.openModal("new", defaultArticle)}  
                icon='plus'
                content='Add Article'
                primary                  
            />
            {/*Table to display all articles. Also forwards edit and delete clicks*/}
            <Table 
                Schema={Schema} 
                openModal={this.openModal} 
                data={this.state.articles} 
            />
        </>
    }

    //Sets the state to render the correct modal with the correct article data
    @autobind
    async openModal(modal: "edit" | "delete" | "new", article: IArticle) {
        await this.setState({article: article, openModal: modal});
    }
    
    //Creates a new cutomer and closes modal
    @autobind
    async closeNewForm(createNew: boolean, article?: IArticle) {
        //Closes modal if interaction was canceled
        if(!createNew) return(await this.setState({ openModal: ""}));
        this.setState({ loading: true })
        //Deletes id so the database can create one
        delete article._id;
        //Sends new article requests
        let response = await insertArticle(article);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        //Updates table manually
        await this.loadArticles();
        //Closes modal
        await this.setState({ openModal: "", loading: false })
    }

    //Edit a article and closes Modal (check closeNewForm for more details)
    @autobind
    async closeEditForm(changeArticle: boolean, article?: IArticle) {
        if(!changeArticle) return(await this.setState({ openModal: ""}));   
        this.setState({ loading: true })
        let response = await updateArticle(this.state.article._id, article);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.loadArticles();
        await this.setState({ openModal: "", loading: false })
    }

    //Deletes a article and closes modal (check closeNewForm for more details)
    @autobind
    async closeDeleteForm(toDelete: boolean, article?: IArticle) {
        if(!toDelete) return(await this.setState({ openModal: ""}));
        await this.setState({ loading: true })
        let response = await deleteArticle(this.state.article._id);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.loadArticles();
        await this.setState({ openModal: "", loading: false })
    }
}
export default Articles;