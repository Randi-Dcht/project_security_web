import {useNavigate} from "react-router-dom";
import {Alert, Button, Card, Container, Image, Stack} from "react-bootstrap";

const Home = () =>
{
    const navigate = useNavigate();


    return(
        <Container>

            <Card className="m-3">
                <Card.Header>Page d'accueil</Card.Header>
                <Card.Body>
                    <Card.Title>Vous êtes déjà membre ?</Card.Title>
                    <Card.Text>
                        
                    </Card.Text>
                    <Stack gap={2} className="col-md-5 mx-auto p-5">
                        <Button onClick={() => navigate("/admin")} variant="secondary">Je suis un administrateur</Button>
                        <Button onClick={() => navigate("/")} variant="secondary">Je suis un docteur</Button>
                        <Button onClick={() => navigate("/connexion")} variant="outline-secondary">Je suis un patient</Button>
                    </Stack>
                </Card.Body>

                <Card.Body>
                    <Card.Title>Vous êtes un patient mais vous n'avez pas de compte ? Inscrivez-vous !</Card.Title>
                    <Card.Text>
                        
                    </Card.Text>
                    <Stack gap={2} className="col-md-5 mx-auto p-5">
                        <Button onClick={() => navigate("/signup")} variant="outline-secondary">S'inscrire</Button>
                    </Stack>
                </Card.Body>
            </Card>
            
        </Container>

    )
}
export default Home;