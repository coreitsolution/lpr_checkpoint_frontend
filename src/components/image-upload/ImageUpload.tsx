import React, { useState } from "react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <Typography variant="p" color="white">
        ค้นหาจากรูปภาพ
      </Typography>
      <Box
        sx={{ marginTop: "20px" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgcolor="#424242"
        color="#FFFFFF"
        p={3}
        borderRadius={2}
        height={300}
      >
        {image ? (
          <Avatar
            src={image}
            sx={{ width: "100%", height: "100%", borderRadius: 1 }}
            alt="Uploaded preview"
          />
        ) : (
          <>
            <AddPhotoAlternateIcon sx={{ fontSize: 50, color: "#2196f3" }} />
            <Typography mt={1}>เพิ่มรูปภาพบุคคล</Typography>
          </>
        )}
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          อัพโหลดรูปภาพ
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
      </Box>
    </div>
  );
};

export default ImageUpload;
