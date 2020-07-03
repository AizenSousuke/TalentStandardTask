/* Photo upload section */
import React, { Component } from "react";
import Cookies from "js-cookie";
import { Image, Button, Grid, Icon, Input } from "semantic-ui-react";

export default class PhotoUpload extends Component {
	constructor(props) {
        super(props);
        
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
        console.log("File :", e.target.value);
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
						<Image
							name="picture"
							as={Button}
							onClick={(e, { name }) => {
								this.handleClick(e, name);
							}}
							src="https://image.flaticon.com/icons/png/512/3/3901.png"
							circular
							bordered
							size={"medium"}
							type="file"
						/>
					) : (
						<React.Fragment>
							<Image
                                name="profilepicture"
								circular
								src={
									this.props.imageId === null ||
									this.props.imageId === undefined
										? this.props.imageId
										: "http://loremflickr.com/100/100/image"
								}
								size={"medium"}
							/>
							<br></br>
							<Button
								name="upload"
								secondary
								fluid
								onClick={(e, { name }) => {
									this.handleClick(e, name);
								}}
							>
								Upload
							</Button>
						</React.Fragment>
					)}
				</Grid.Column>
			</Grid>
		);
	}
}
