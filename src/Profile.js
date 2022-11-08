import { useEffect, useState } from "react";
import { Storage, API } from "aws-amplify";
import { GrFormClose } from "react-icons/gr";

import {
  useAuthenticator,
  Alert,
  Badge,
  Button,
  Flex,
  Heading,
  Text,
  View,
  Icon,
  Placeholder,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "@aws-amplify/ui-react";

import Header from "./components/Header";

Storage.configure({ level: "private" });

export default function Profile() {
  const { user } = useAuthenticator((context) => [context.route]);
  const [message, setMessage] = useState();
  const [file, setFile] = useState();
  const [files, setFiles] = useState([]);
  const [waitingForFiles, setWaitingForFiles] = useState(true);

  useEffect(() => {
    updateFiles();

    API.get("apprunner-api", "/")
      .then((response) => {
        setMessage(response.message);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  function updateFiles() {
    Storage.list("data/", { level: "private" })
      .then((result) => {
        const newFiles = [...result];
        setFiles([...newFiles]);

        setWaitingForFiles(false);
      })
      .catch((err) => console.log(err));
  }

  async function deleteFile(key) {
    const confirm = window.confirm(
      `Are you sure that you want to delete ${key.split("/")[1]}?`
    );

    if (confirm) {
      await Storage.remove(key, { level: "private" });
      updateFiles();
    }
  }

  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  function resetForm() {
    setFile(null);
    document.getElementById("upload-form").reset();
  }

  async function handleFileSubmit(event) {
    event.preventDefault();
    if (!file) return;

    try {
      await Storage.put(`data/${file.name}`, file, {
        level: "private",
      });
      setFile(null);
      event.target.reset();
    } catch (err) {
      alert(err);
    }

    updateFiles();
  }

  return (
    <View padding="2rem" align="center" justifyContent="center">
      <Header />

      <View marginTop="4rem">
        <main>
          <View width="80%" align="left">
            <Badge size="small" variation="info" marginBottom={"2rem"}>
              Free plan
            </Badge>
            <Heading level={3}>Hey, {user?.attributes.email} 👋</Heading>

            <Alert
              isDismissible={false}
              hasIcon={true}
              heading="Get more with Pro"
              marginTop={"2rem"}
            >
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                {/* from AppRunner API */}
                <Text>{message}</Text>

                <Button
                  marginLeft={"2rem"}
                  variation="primary"
                  loadingText="loading"
                  onClick={() => alert("hello")}
                  ariaLabel=""
                >
                  Upgrade to Pro Plan
                </Button>
              </Flex>
            </Alert>
          </View>
        </main>
      </View>

      <View width="80%" marginTop={"3rem"} align="left">
        <Heading marginTop={"2rem"} level={5}>
          Data
        </Heading>

        <form onSubmit={handleFileSubmit} id="upload-form">
          <input type="file" onChange={handleFileChange} />
          {file && (
            <>
              <Icon
                ariaLabel="Clear file"
                as={GrFormClose}
                onClick={resetForm}
                marginRight="2rem"
              />

              <Button
                size="small"
                variation="primary"
                type="submit"
                disabled={file?.name.length > 0 ? false : true}
              >
                Upload
              </Button>
            </>
          )}
        </form>

        <View marginTop={"3rem"}>
          {waitingForFiles ? (
            <>
              <Placeholder marginTop={"1rem"} />
              <Placeholder marginTop={"1rem"} />
              <Placeholder marginTop={"1rem"} />
            </>
          ) : files.length > 0 ? (
            <Table width={"100%"} highlightOnHover={true} variation={"striped"}>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Name</TableCell>
                  <TableCell as="th">Last modified</TableCell>
                  <TableCell as="th">Size</TableCell>
                  <TableCell as="th">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files?.map((file) => (
                  <TableRow key={file.key.split("/")[1]}>
                    <TableCell>{file.key.split("/")[1]}</TableCell>
                    <TableCell>
                      {file.lastModified.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>
                      <Flex gap={"1rem"}>
                        <Button
                          size="small"
                          variation="link"
                          onClick={() => deleteFile(file.key)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Alert
              isDismissible={false}
              hasIcon={true}
              heading="No data yet"
              marginTop={"2rem"}
            ></Alert>
          )}
        </View>
      </View>
    </View>
  );
}
