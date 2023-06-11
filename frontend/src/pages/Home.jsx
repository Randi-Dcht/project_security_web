import {useNavigate} from "react-router-dom";
import {Alert, Button, Card, Container, Image, Stack} from "react-bootstrap";

const Home = () =>
{
    const navigate = useNavigate();

    const connect = async function () {
        try {
            const response = await fetch('https://localhost:1026/me', {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (! data.roles.includes("ROLE_USER")){
                navigate("/error");
            } else if (data.roles.includes("ROLE_ADMIN")) {
                navigate("/admin");
            } else if (data.roles.includes("ROLE_DOCTOR")) {
                navigate("/doctor");
            } else if (data.roles.includes("ROLE_PATIENT")) {
                navigate("/patient");
            }

        } catch (error) {
            console.error('Erreur lors de la requête HTTPS:', error);
            navigate("/error");
        }
    }

    return(
        <Container>

            <Card className="m-3">
                <Card.Header>Page d'accueil</Card.Header>
                <Card.Body>
                    <Card.Title>Vous êtes déjà membre ?</Card.Title>
                    <Card.Text>
                        
                    </Card.Text>
                    <Stack gap={2} className="col-md-5 mx-auto p-5">
                        <Button onClick={connect} variant="outline-secondary">Connexion</Button>
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