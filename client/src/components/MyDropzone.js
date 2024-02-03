import { useDropzone } from "react-dropzone";
import "@fortawesome/fontawesome-free/css/all.css";
import Stack from "react-bootstrap/esm/Stack";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/esm/Alert";

const thumbsContainer = {
	display: "flex",
	flexDirection: "row",
	flexWrap: "wrap",
};

const thumb = {
	display: "inline-flex",
	borderRadius: 2,
	border: "1px solid #eaeaea",
	width: 100,
	height: 100,
	padding: 4,
	boxSizing: "border-box",
};

const thumbInner = {
	display: "flex",
	minWidth: 0,
	overflow: "hidden",
};

const img = {
	display: "block",
	width: "auto",
	height: "100%",
};

const MyDropzone = ({ onFilesChange, reset }) => {
	const [files, setFiles] = useState([]);
	const [error, setError] = useState(null);

	const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
		useDropzone({
			accept: {
				"image/*": [],
			},
			onDrop: (acceptedFiles) => {
				if (acceptedFiles.length !== 1) {
					setError("Too many files");
					setFiles([]); // Clear files if more than one file is uploaded
					return;
				}
				const maxSizeInBytes = 3 * 1024 * 1024; // 3 MB
				const file = acceptedFiles[0];

				if (file.size > maxSizeInBytes) {
					setError("File size exceeds the limit (3 MB)");
					setFiles([]); // Clear files if the size exceeds the limit
					return;
				}

				setFiles(
					acceptedFiles.map((file) =>
						Object.assign(file, {
							preview: URL.createObjectURL(file),
						})
					)
				);
				setError(null);
			},
			maxSize: 3 * 1024 * 1024, // 3 MB
			maxFiles: 1,
		});

	const thumbs = files.map((file) => (
		<div style={thumb} key={file.name}>
			<div style={thumbInner}>
				<img
					src={file.preview}
					style={img}
					alt="image_preview"
					// Revoke data uri after image is loaded
					onLoad={() => {
						URL.revokeObjectURL(file.preview);
					}}
				/>
			</div>
		</div>
	));

	useEffect(() => {
		if (reset) {
			// Clear files and reset state when reset is true
			setFiles([]);
			setError(null);
		}
	}, [reset]);

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks; will run on unmount
		return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, [files, error]);

	// Call the parent component's function when files change
	useEffect(() => {
		onFilesChange(acceptedFiles);
	}, [acceptedFiles, onFilesChange]);

	return (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			<Stack
				direction="horizontal"
				className="border rounded justify-content-center"
			>
				<div className="p-2">
					<aside style={thumbsContainer}>{thumbs}</aside>
					{/* Render the icon only if there are no files */}
					{error && <Alert variant="danger">{error}</Alert>}
					{!error && files.length === 0 && (
						<i className="fas fa-cloud-upload fa-4x py-3"></i>
					)}
				</div>

				<div className="p-2 text-center justify-content-center">
					{isDragActive ? (
						<b>Drop file here</b>
					) : (
						<>
							<b>Drop an image</b>
							<p className="m-0">or</p>
							<b>Click to browse</b>
							<br />
							<small>
								<small>Max 1 file(3MB)</small>
							</small>
						</>
					)}
				</div>
			</Stack>
		</div>
	);
};

export default MyDropzone;
