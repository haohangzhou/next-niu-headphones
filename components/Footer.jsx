import { AiOutlineInstagram, AiOutlineLinkedin } from 'react-icons/ai';

const Footer = () => {
	return (
		<div className='footer-container'>
			<p>Created by Joe Zhou</p>
			<p className='icons'>
				<AiOutlineInstagram
					onClick={() => window.open('https://www.instagram.com/jiu0_0/')}
				/>
				<AiOutlineLinkedin
					onClick={() => window.open('https://www.linkedin.com/in/joe-hz/')}
				/>
			</p>
		</div>
	);
};

export default Footer;
