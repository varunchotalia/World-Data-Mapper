import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory } from "react-router-dom";
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const UpdateAccount = (props) => {
	const [input, setInput] = useState({ _id: props.user._id, oldEmail: props.user.email, email: props.user.email, password: '', name: props.user.name });
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE);
    const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "New email already exists or user not found";
    const history = useHistory();

	const updateInput = (e) => {
		const { name, value } = e.target;
        console.log(name);
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to update');
				return;
			}
		}
		const { loading, error, data } = await Update({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}`};
        if (!data) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			console.log(data)
			toggleLoading(false);
			props.fetchUser();
			props.setShowUpdate(false);
            history.push("/welcome");
		};
	};

	return (
		<WModal className="signup-modal"  cover="true" visible={props.setShowUpdate}>
			<WMHeader  className="modal-header" onClose={() => props.setShowUpdate(false)}>
				Enter Updated Account Information
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
							<WRow className="modal-col-gap signup-modal" style={{paddingLeft:"130px"}}>
								<WCol size="10">
									<WInput 
										className="" style={{color:"white"}} onBlur={updateInput} name="name" labelAnimation="up" 
										barAnimation="solid" labelText="Name" wType="outlined" inputType="text" defaultValue={props.user.name}
									/>
								</WCol>
							</WRow>

							<div className="modal-spacer">&nbsp;</div>
					<WRow style={{paddingLeft:"130px"}}>
                        <WCol size="10">	
                            <WInput 
								className="modal-input" style={{color:"white"}} onBlur={updateInput} name="email" labelAnimation="up" 
								barAnimation="solid" labelText="Email" wType="outlined" inputType="text" defaultValue={props.user.email}
							/>
                            </WCol>
                     </WRow>
                     <WRow  style={{paddingLeft:"130px"}}>
                         <WCol size="10">
							<div className="modal-spacer">&nbsp;</div>
							<WInput 
								className="modal-input" style={{color:"white"}} onBlur={updateInput} name="password" labelAnimation="up" 
								barAnimation="solid" labelText="Password" wType="outlined" inputType="password" defaultValue={props.user.password}
							/>
                        </WCol>
                    </WRow>
					</WMMain>
			}
                    {
							showErr ? <div className='modal-error' style={{paddingLeft:"130px"}}>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}
			<WMFooter style={{border: "0px"}}>
				<WButton className="modal-button" style={{marginLeft:"27px", backgroundColor: "grey"}} size="medium"  onClick={handleUpdateAccount}  clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Update
				</WButton>
                <WButton className="modal-button" style={{marginLeft:"180px", backgroundColor: "grey"}} size="medium" onClick={() => props.setShowUpdate(false)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</WMFooter>
			
		</WModal>
	);
}

export default UpdateAccount;
