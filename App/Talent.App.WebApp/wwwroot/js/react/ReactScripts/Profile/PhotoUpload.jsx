/* Photo upload section */
import React, { Component } from "react";
import Cookies from "js-cookie";
import { Image, Button, Grid, Icon, Input } from "semantic-ui-react";

export default class PhotoUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			file: "",
			disableButtons: false,
		};

		this.input = React.createRef();
	}

	handleClick(e, name) {
		e.preventDefault();
		// console.log(e.target.name, name);

		// Upload filepicker
		// console.log(this.input);
		this.input.current.inputRef.click();
	}

	handleUploadImage(e) {
		e.preventDefault(e);
		// console.log("File :", e.target.value);
		// this.setState({ file: e.target.value });
		this.setState({ file: URL.createObjectURL(e.target.files[0]) });
		// console.log(this.input.current);
	}

	confirmUploadImage(e) {
		e.preventDefault(e);
		// Disable buttons
		this.setState({ disableButtons: true }, () => {
			// console.log(this.input.current.inputRef.files);
			if (this.input.current.inputRef.files.length !== 0) {
				// console.log(this.input.current.inputRef.files[0], this.state.file);
				var formData = new FormData();
				formData.append("file", this.input.current.inputRef.files[0]);
				console.log(formData.get("file"));
				var cookies = Cookies.get("talentAuthToken");
				$.ajax({
					url:
						"https://talentservicesprofilenik.azurewebsites.net/profile/profile/updateProfilePhoto",
					headers: {
						Authorization: "Bearer " + cookies,
					},
					type: "POST",
					processData: false,
					contentType: false,
					data: formData,
					success: function (res) {
						console.log(res);
						if (res.success == true) {
							// Maybe reload the data here?
							this.setState({ file: "" });
							this.props.loadData();
							TalentUtil.notification.show(
								"Photo updated successfully",
								"success",
								null,
								null
							);
						} else {
							TalentUtil.notification.show(
								"Photo did not update successfully",
								"error",
								null,
								null
							);
						}
						// Enable buttons
						this.setState({ disableButtons: false });
					}.bind(this),
					error: function (res, a, b) {
						console.log(res);
						console.log(a);
						console.log(b);
					},
				});
			}
		});
	}

	render() {
		return (
			<Grid columns={"equal"} container>
				<Grid.Row>
					<Grid.Column></Grid.Column>
					<Grid.Column>
						<Input
							name="pictureupload"
							type="file"
							ref={this.input}
							style={{ display: "none" }}
							onChange={(e) => {
								this.handleUploadImage(e);
							}}
							disabled={this.state.disableButtons}
						/>
						{this.props.imageId === null ? (
							<React.Fragment>
								<Image
									name="picture"
									as={Button}
									onClick={(e, { name }) => {
										this.handleClick(e, name);
									}}
									src={
										this.state.file === ""
											? "https://image.flaticon.com/icons/svg/25/25326.svg"
											: this.state.file
									}
									circular
									bordered
									size={"medium"}
									type="file"
								/>
								<p></p>
								{this.state.file !== "" && (
									<Button
										name="upload"
										color={"teal"}
										fluid
										onClick={(e) => {
											this.confirmUploadImage(e);
										}}
										disabled={this.state.disableButtons}
									>
										Upload
									</Button>
								)}
							</React.Fragment>
						) : (
							<React.Fragment>
								<Image
									as={Button}
									name="profilepicture"
									circular
									src={
										this.state.file === ""
											? this.props.imageId
											: this.state.file
									}
									size={"medium"}
									onClick={(e, { name }) => {
										this.handleClick(e, name);
									}}
									disabled={this.state.disableButtons}
								/>
								<p></p>
								{this.state.file !== "" && (
									<Button
										name="upload"
										color={"teal"}
										fluid
										onClick={(e) => {
											this.confirmUploadImage(e);
										}}
										disabled={this.state.disableButtons}
									>
										<Icon name="upload" />
										Upload
									</Button>
								)}
							</React.Fragment>
						)}
					</Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}
