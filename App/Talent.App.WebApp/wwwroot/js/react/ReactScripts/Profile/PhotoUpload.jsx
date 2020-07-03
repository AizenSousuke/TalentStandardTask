/* Photo upload section */
import React, { Component } from "react";
import Cookies from "js-cookie";
import { Image, Button, Grid, Icon, Input } from "semantic-ui-react";

export default class PhotoUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			file: "",
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
		// console.log(this.input.current.inputRef.files);
		if (this.input.current.inputRef.files.length !== 0) {
			// console.log(this.input.current.inputRef.files[0], this.state.file);
			var formData = new FormData();
			formData.append("file", this.input.current.inputRef.files[0]);
			console.log(formData.get("file"));
			var cookies = Cookies.get("talentAuthToken");
			$.ajax({
				url:
					"http://localhost:60290/profile/profile/updateProfilePhoto",
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
				}.bind(this),
				error: function (res, a, b) {
					console.log(res);
					console.log(a);
					console.log(b);
				},
			});
		}
	}

	render() {
		return (
			<Grid container columns="equal">
				<Grid.Column width={4}>
					<Input
						name="pictureupload"
						type="file"
						ref={this.input}
						style={{ display: "none" }}
						onChange={(e) => {
							this.handleUploadImage(e);
						}}
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
										? "https://image.flaticon.com/icons/png/512/3/3901.png"
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
									secondary
									fluid
									onClick={(e) => {
										this.confirmUploadImage(e);
									}}
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
							/>
                            <p></p>
							{this.state.file !== "" && (
								<Button
									name="upload"
									secondary
									fluid
									onClick={(e) => {
										this.confirmUploadImage(e);
                                    }}
								>
                                    <Icon name="upload" />
									Upload
								</Button>
							)}
						</React.Fragment>
					)}
				</Grid.Column>
			</Grid>
		);
	}
}
