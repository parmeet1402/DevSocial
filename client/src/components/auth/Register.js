import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    //prevent logged in user to enter register page
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  // maps errors to state... which are first brought and mapped to props
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  onSubmit(event) {
    event.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      errors: this.state.errors
    };

    // sending data to registerUser action
    this.props.registerUser(newUser, this.props.history);

    /* axios
      .post("/api/users/register", newUser)
      .then(res => console.log(res.data))
      .catch(err => this.setState({ errors: err.response.data })); */
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">
                  Create your Dev Social account
                </p>
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    type="text"
                    error={errors.name}
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                  />
                  <TextFieldGroup
                    type="email"
                    error={errors.email}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    info="This site uses Gravatar so if you want a profile image,
                      use a Gravatar email id"
                  />

                  <TextFieldGroup
                    type="password"
                    error={errors.password}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />

                  <TextFieldGroup
                    type="password"
                    error={errors.password2}
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}
                  />

                  <input
                    type="submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// map props to prop types
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
