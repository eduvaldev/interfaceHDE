import React from "react"
import {
    // Media,
    Row,
    Col,
    Button,
    Form,
    Input,
    Label,
    FormGroup,
    // Table,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CustomInput
} from "reactstrap"
// import userImg from "../../../assets/img/portrait/small/avatar-s-18.jpg"
// import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Lock } from "react-feather"
import { connect } from "react-redux"
import { updateData, profile } from "../../../redux/actions/usermanagement"
import config from "../../../configs/config"
import { toast } from 'react-toastify'
import jwt_decode from 'jwt-decode'
import Select from "react-select"
import * as Icon from "react-feather"

const roles = [
    {value:"staff", label:"staff"},
    {value:"modérateur", label:"modérateur"},
    {value:"streamer VIP", label:"streamer VIP"},
    {value:"streamer", label:"streamer"},
  ]

  const status = [
    {value:"activer", label:"activer"},
    {value:"désactiver", label:"désactiver"},
  ]

class UserAccountTab extends React.Component {

    state = {
        _id: "",
        username: "",
        email: "",
        twitch_channel_link: "",
        stream_key: "",
        avatar: "",
        stream_pic: "",
        old_password: "",
        new_password: "",
        streaming_status: "offline",
        confirm_password: "",
        avatar_file: null,
        stream_pic_file: null,
        resume: "",
        role: "streamer",
        status: "activer",
        streamkey_status: "activer",
        note: {}
    }

    componentDidUpdate(prevProps, state){
        if(prevProps != this.props){
            console.log("Props: ", this.props.userProfile);
            this.setState({... this.props.userProfile});
            this.setState({note: this.props.userNote});
        }
    }

    async componentDidMount() {
        var token = localStorage[config.token];
        if(token){
            var userinfo = jwt_decode(token);
        }
        const {username} = userinfo;

        // this.setState({
        //     _id: _id,
        //     username: username,
        //     email: email,
        //     twitch_channel_link: twitch_channel_link,
        //     stream_key: stream_key,
        //     avatar: avatar,
        //     stream_pic: stream_pic
        // })
        await this.props.profile({username: username});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(!this.state.username){
            toast.warning("You must input username");
            return;
        }

        if(this.state.new_password && !this.state.old_password){
            toast.warning("Please input old password");
            return;
        }

        if(this.state.new_password && this.state.new_password != this.state.confirm_password){
            toast.warning("Please input correct confirm password");
            return;
        }

        this.props.updateData(this.state, true);
    }

    render() {

        const {username, email, twitch_channel_link, stream_key, avatar,
            stream_pic, old_password, new_password, confirm_password, streaming_status,
            resume, role, status, streamkey_status} = this.state;
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Perfil de usuario</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col sm="6">
                        { avatar ? (
                            <FormGroup className="text-center">
                            <img className="img-fluid" style={{height:"200px"}} src={avatar.indexOf('blob')>-1?avatar:`${config.host}${avatar}`} alt={username} />
                            <div className="d-flex flex-wrap justify-content-between mt-2">
                                <label
                                className="btn btn-flat-primary"
                                htmlFor="update-avatar"
                                color="primary">
                                Charger un Avatar
                                <input
                                    type="file"
                                    id="update-avatar"
                                    hidden
                                    onChange={e =>
                                    this.setState({
                                        avatar: URL.createObjectURL(e.target.files[0]),
                                        avatar_file: e.target.files[0]
                                    })
                                    }
                                />
                                </label>
                                <Button
                                color="flat-danger"
                                onClick={() => this.setState({ avatar: "", avatar_file:null })}>
                                Remove Avatar
                                </Button>
                            </div>
                            </FormGroup>
                        ) : <label
                                className="btn btn-primary"
                                htmlFor="upload-avatar"
                                color="primary">
                                Charger un Avatar
                                <input
                                type="file"
                                id="upload-avatar"
                                hidden
                                onChange={e =>
                                    this.setState({ avatar: URL.createObjectURL(e.target.files[0]), avatar_file: e.target.files[0]})
                                }
                                />
                            </label>}
                        </Col>
                        <Col sm="6">
                        { stream_pic ? (
                            <FormGroup className="text-center">
                            <img className="img-fluid" style={{height:"200px"}} src={stream_pic.indexOf('blob')>-1?stream_pic:`${config.host}${stream_pic}`} alt={username} />
                            <div className="d-flex flex-wrap justify-content-between mt-2">
                                <label
                                className="btn btn-flat-primary"
                                htmlFor="update-stream"
                                color="primary">
                                Charger photo du streameur
                                <input
                                    type="file"
                                    id="update-stream"
                                    hidden
                                    onChange={e =>
                                    this.setState({
                                        stream_pic: URL.createObjectURL(e.target.files[0]),
                                        stream_pic_file: e.target.files[0]
                                    })
                                    }
                                />
                                </label>
                                <Button
                                color="flat-danger"
                                onClick={() => this.setState({ stream_pic: "", stream_pic_file:null })}>
                                    Remove Stream Picture
                                </Button>
                            </div>
                            </FormGroup>
                        ) : <label
                                className="btn btn-primary"
                                htmlFor="upload-stream"
                                color="primary">
                                    Charger photo du streameur
                                <input
                                type="file"
                                id="upload-stream"
                                hidden
                                onChange={e =>
                                    this.setState({ stream_pic: URL.createObjectURL(e.target.files[0]), stream_pic_file: e.target.files[0]})
                                }
                                />
                            </label>}
                        </Col>
                        <Col sm="12">
                            <Form onSubmit={e => this.handleSubmit(e)}>
                                <Row>
                                    <Col md="6" sm="12">
                                        <FormGroup>
                                            <Label for="username">Utilisateur</Label>
                                            <Input
                                                type="text"
                                                value={username}
                                                id="username"
                                                name="username"
                                                onChange={e => this.setState({username: e.target.value})}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" sm="12">
                                        <FormGroup>
                                            <Label for="email">Correo Electrónico</Label>
                                            <Input
                                                type="email"
                                                value={email}
                                                id="email"
                                                name="email"
                                                onChange={e => this.setState({email: e.target.value})}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md="6" sm="12">
                                        <FormGroup>
                                            <Label for="email">Lien chaine Twitch</Label>
                                            <Input
                                                type="text"
                                                id="twitch_channel"
                                                value={twitch_channel_link}
                                                onChange={e => this.setState({twitch_channel_link: e.target.value})}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" sm="12">
                                        <FormGroup>
                                            <Label for="data-kj">Presentation</Label>
                                            <Input
                                            type="textarea"
                                            id="resume"
                                            style={{height:"195px"}}
                                            value={this.state.resume}
                                            disabled={this.props.onlyView?true:false}
                                            onChange={e => this.setState({ resume: e.target.value })} />

                                        </FormGroup>
                                    </Col>
                                    <Col md="6" sm="12">
                                        <FormGroup>
                                            <Label for="data-area">Rol: </Label>
                                            <Input value={this.state.role} disabled={true} />
                                            {/* <Select
                                            className="React mr-3"
                                            classNamePrefix="select"
                                            disabled={this.props.onlyView?true:false}
                                            name="role"
                                            value={{value:this.state.role,label:this.state.role}}
                                            options={roles}
                                            onChange={e => this.setState({role: e.value})}
                                            >
                                            </Select> */}
                                            {/* <Label>{this.state.role}</Label>     */}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="data-skintype">Acces dashboard: </Label>
                                            {/* <Select
                                            className="React mr-3"
                                            disabled={this.props.onlyView?true:false}
                                            classNamePrefix="select"
                                            value={{value:this.state.status,label:this.state.status}}
                                            name="status"
                                            options={status}
                                            onChange={e => this.setState({ status: e.value })}
                                            >
                                            </Select> */}
                                            <Input value={this.state.status} disabled={true} />
                                            {/* <Label>{this.state.status}</Label>     */}
                                        </FormGroup>

                                        <FormGroup>
                                        <Label for="data-skintype">Status de la cles de stream: </Label>
                                        {/* <Label>{this.state.streamkey_status}</Label> */}
                                        <Input value={this.state.streamkey_status} disabled={true} />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12">
                                        <div className="permissions border px-2">
                                            <div className="title pt-2 pb-0">
                                                <Lock size={19} />
                                                <span className="text-bold-500 font-medium-2 ml-50">
                                                Changer de mot de passe
                                                </span>
                                                <hr />
                                            </div>
                                                <FormGroup>
                                                    <Label for="company">Ancien mot de passe</Label>
                                                    <Input
                                                        type="password"
                                                        id="old_password"
                                                        value={old_password}
                                                        onChange={e => this.setState({old_password: e.target.value})}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="company">Nouveau mot de passe</Label>
                                                    <Input
                                                        type="password"
                                                        id="new_password"
                                                        value={new_password}
                                                        onChange={e => this.setState({new_password: e.target.value})}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="company">Confirmer le mot de passe</Label>
                                                    <Input
                                                        type="password"
                                                        id="confirm_password"
                                                        value={confirm_password}
                                                        onChange={e => this.setState({confirm_password: e.target.value})}
                                                    />
                                                </FormGroup>

                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        {Object.keys(this.state.note).length > 0 ? (
                                            <div className="d-flex mt-2">
                                                {this.state.note.type == 'notes'?<td><Icon.FileText size={30} className="text-white mr-2" /></td>:null}
                                                {this.state.note.type == 'good'?<td><Icon.ThumbsUp size={30} className="text-success mr-2" /></td>:null}
                                                {this.state.note.type == 'warning'?<td><Icon.AlertTriangle size={30} className="text-warning mr-2" /></td>:null}
                                                <span className="align-self-center">{this.state.note.notes}</span>
                                            </div>
                                        ) : null}
                                    </Col>
                                    <Col
                                        className="d-flex justify-content-end flex-wrap mt-2"
                                        sm="12"
                                    >
                                        <Button.Ripple className="mr-1" color="primary">
                                        MAJ
                                        </Button.Ripple>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    console.log("State: ", state);
    return {
        userinfo: state.auth.userinfo,
        userProfile: state.users.profile,
        userNote: state.users.note
    }
  }

  export default connect(mapStateToProps, {
    profile,
    updateData
  })(UserAccountTab)
