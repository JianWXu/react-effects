import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Deck() {
  const deckId = useRef();
  const [card, setCard] = useState([]);
  const [deckHidden, setDeckHidden] = useState(false);
  const deckURL =
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
  const intervalRef = useRef(null); // Ref to hold the interval ID

  useEffect(() => {
    async function fetchDeckId() {
      try {
        const response = await axios.get(deckURL);
        deckId.current = response.data.deck_id;
      } catch (error) {
        console.error("Error fetching deck ID:", error);
      }
    }
    fetchDeckId();

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  async function getCard() {
    const res = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`
    );

    const addCardToPile = () => {
      let newCard = {
        image: res.data.cards[0].image,
        value: res.data.cards[0].value,
        suit: res.data.cards[0].suit,
      };
      //   setCard(prevCard => [...prevCard, newCard]);

      setCard(prevCard => {
        const updatedCard = [...prevCard, newCard];
        console.log("Updated card length:", updatedCard.length); // Check if the card state is updated correctly
        return updatedCard;
      });
    };
    addCardToPile();
  }

  const drawCard = async () => {
    await getCard();
  };

  //   const drawEachSecond = () => {
  //     try {
  //       intervalRef.current = setInterval(() => {
  //         console.log("Card length:", card.length);
  //         if (card.length >= 52) {
  //           console.log("Stopping interval");
  //           clearInterval(intervalRef.current); // Stop the interval if 52 or more cards have been drawn
  //           return;
  //         }
  //         drawCard(); // Draw a card if 52 or more cards haven't been drawn yet
  //       }, 1000);
  //     } catch (e) {
  //       console.log("Error running timer", e);
  //     }
  //   };

  //   useEffect(() => {
  //     drawEachSecond();
  //     return () => {
  //       if (intervalRef.current) {
  //         clearInterval(intervalRef.current);
  //       }
  //     };
  //   }, []);

  const message = () => {
    alert("You are out of cards");
  };

  useEffect(() => {
    if (card.length < 53) {
      const intervalId = setInterval(() => {
        console.log("Card length:", card.length);
        if (card.length === 52) {
          console.log("Stopping interval");
          message();
          clearInterval(intervalId); // Stop the interval if 52 or more cards have been drawn
        } else {
          drawCard(); // Draw a card if 52 or more cards haven't been drawn yet
        }
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup the interval on component unmount or when card count exceeds 52
    }
  }, [card]);

  const toggle = evt => {
    setDeckHidden(isHidden => !isHidden);
  };

  return (
    <div className="Deck">
      <div>
        {deckHidden
          ? null
          : card.length > 0 &&
            card.length < 52 && (
              <img src={card[card.length - 1].image} alt="Card" />
            )}
        {/* {message()} */}
        <button onClick={toggle}>
          {deckHidden ? "Show Deck" : "Hide Deck"}
        </button>
      </div>
    </div>
  );
}

export default Deck;
