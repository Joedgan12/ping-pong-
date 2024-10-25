var screen = document.querySelector("canvas");
var design = screen.getContext("2d");
var widthRacket = 10, heightRacket = 75;
var X_racket1, Y_racket1, X_racket2, Y_racket2;
var RacketMovementRate = 25, BallMovementRate = 2;
var hit, numberBeats, SpeedIncrease = 0.2;
var horizontal = {};
var vertical = {};
var rayball = 10, X_ball, Y_ball;
var renderizationBall;
var pointsRacket1, pointsRacket2, limitPoints;
var player1, player2;

//Midfield line
design.fillStyle = "white";
design.fillRect(0, 249, 1280, 3);

function startGame()
{
    document.getElementById("play").disabled = true;

    player1 = prompt("player 1's Nickname:");
    player2 = prompt("player 2's nickname:");
    limitPoints = prompt("Maximum amount of points for victory:");

    pointsRacket1 = 0;
    pointsRacket2 = 0;
    document.getElementById("player1").innerHTML = player1;
    document.getElementById("player2").innerHTML = player2;
    document.getElementById("racket_points1").innerHTML = pointsRacket1;
    document.getElementById("racket_points2").innerHTML = pointsRacket2;

    X_racket1 = 50;
    Y_racket1 = 200;
    X_racket2 = 1230;
    Y_racket2 = 200;

    X_ball = 640;
    Y_ball = 250;
    horizontal["left"] = Math.floor(Math.random() * 2) == 0?false:true;
    horizontal["right"] = !horizontal["left"];
    vertical["up"] = Math.floor(Math.random() * 2) == 0?false:true;
    vertical["low"] = !vertical["up"];

    hit = false;
    numberBeats = 0;
    BallMovementRate = 2;

    drawRacket1();
    drawRacket2();

    renderizationBall = setInterval(moveball, 10);
}


function endGame(winner)
{
    if(winner == 1)
    {
        var playerWinner = player1;
    }
    else
    {
        var playerWinner = player2;
    }
    alert(`Congrats,${playerWinner}!! You won!\n\nscore:${pointsRacket1}x${pointsRacket2}`);

    document.getElementById("play").disabled = false;
}


function moveBall()
{
    renderScreen();

    if(horizontal["left"])
    {
        X_ball -= BallMovementRate;

        //Testing if the bal invaded field of racket 1
        if(X_ball - rayball <= 0)
        {
            countPoint(2);
        }

        //Testing collision of racket 1 on the top end of the ball
        if((Y_ball - rayball <= Y_racket1 + heightRacket) && (Y_ball - rayball >= Y_racket1))
        {
            if((X_ball >= X_racket1) && (X_ball <= X_racket1 + widthRacket))
            {
                horizontal["left"] = false;
                horizontal["right"] = true;
                hit = true;
            }
        }

        //Testing collision of racket 1 on the bottom end of the ball
        if((Y_ball + rayball >= Y_racket1) && (Y_ball + rayball <= Y_racket1 + heightRacket))
        {
            if((X_ball >= X_racket1) && (X_ball <= X_racket1 + widthRacket))
            {
                horizontal["left"] = false;
                horizontal["right"] = true;
                hit = true;
            }
        }
    }
    else
    {
        X_ball += BallMovementRate;

        //Testing if the ball invaded the field of racket 2
        if(X_ball + rayball >= 1280)
        {
            countPoint(1);
        }

        //Testing collision of racket 2 on the top end of the ball
        if((Y_ball - rayball <= Y_racket2 + heightRacket) && (Y_ball - rayball >= Y_racket2))
        {
            if((X_ball >= X_racket2) && (X_ball <= X_racket2 + widthRacket))
            {
                horizontal["left"] = true;
                horizontal["right"] = false;
                hit = true;
            }
        }

        //Testing collision of racket 2 on the bottom end of the ball
        if((Y_ball + rayball >= Y_racket2) && (Y_ball + rayball <= Y_racket2 + heightRacket))
        {
            if((X_ball >= X_racket2) && (X_ball <= X_racket2 + widthRacket))
            {
                horizontal["left"] = true;
                horizontal["right"] = false;
                hit = true;
            }
        }

    }

    if(vertical["up"])
    {
        Y_ball -= BallMovementRate;
        if(Y_ball - rayball <= 0)
        {
            vertical["up"] = false;
            vertical["low"] = true;
        }
    }
    else
    {
        Y_ball += BallMovementRate;
        if(Y_ball + rayball >= 500)
        {
            vertical["up"] = true;
            vertical["low"] = false;
        }
    }

    if(hit)
    {
        numberBeats++;
        hit = false;
    }
    
    if((numberBeats >= 5) && (BallMovementRate <= 5))
    {
        numberBeats = 0;
        BallMovementRate += SpeedIncrease;
        console.log(BallMovementRate);
    }
}


function countPoint(team)
{
    clearInterval(renderizationBall);

    if(team == 1)
    {
        pointsRacket1++;
    }
    else
    {
        pointsRacket2++;
    }

    document.getElementById("racket_points1").innerHTML = pointsRacket1;
    document.getElementById("racket_points2").innerHTML = pointsRacket2;

    if((pointsRacket1 >= limitPoints) || (pointsRacket2 >= limitPoints))
    {
        endGame(team);
    }
    else
    {
        setTimeout(function(){
            X_ball = 640;
            Y_ball = 250;
            horizontal["left"] = !horizontal["left"];
            horizontal["right"] = !horizontal["right"];
            BallMovementRate = 2;
            numberBeats = 0;
            renderizationBall = setInterval(moveBall, 10);
        }, 1000);
    }
}

function drawBall()
{
    design.beginPath();
    design.fillStyle = "black";
    design.arc(X_ball, Y_ball, rayball, 0, 2*Math.IP);
    design.fillStyle();

    design.beginPath();
    design.fillStyle = "#dbdbdb";
    design.arc(X_ball, Y_ball, rayball-1, 0, 2*Math.IP);
    design.fillStyle();
}

function drawRacket1()
{
    design.fillStyle = "#de6e28";
    design.fillRect(X_racket1, Y_racket1, widthRacket, heightRacket);
}

function drawRacket2()
{
    design.fillStyle = "#4989ad";
    design.fillRect(X_racket2, Y_racket2, widthRacket, heightRacket);
}

function captureMovement(event)
{
    var code = event.keyCode;

    switch(code)
    {
        //Up -> Racket 1
        case 87:
            if(Y_racket1 > 0)
            {
                Y_racket1 -= RacketMovementRate;
            }
            break;

            //Down -> Racket 1
            case 83:
                if(Y_racket1 + heightRacket < 500)
                {
                    Y_racket1 += RacketMovementRate;
                }
                break;

                //Down -> Racket 2
                case 40:
                    if(Y_racket2 + heightRacket < 500)
                    {
                        Y_racket2 += RacketMovementRate;
                    }
                    break;

                    //Up -> Racket 2
                    case 38:
                        if(Y_racket2 > 0)
                        {
                            Y_racket2 -= RacketMovementRate;
                        }
                        break;
    }

    renderScreen();

    return false;
}


function renderScreen()
{
    clearscreen();
    drawRacket1();
    drawRacket2();
    drawBall();
}


function clearscreen()
{
    design.fillStyle = "rgb(136, 255, 89)";
    design.fillRect(0, 0, 1280, 500);
    design.fillStyle = "white";
    design.fillRect(0, 249, 1280, 3);
}

document.onkeydown = captureMovement;