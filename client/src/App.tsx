import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, AppBar, Box, Button, Card, CardActions, CardContent, CardMedia, Container, Divider, TextField, Toolbar, Typography } from "@mui/material";
import { type Book, useBooksQuery, useCreateOrderMutation, useCreatePaymentOrderMutation, useLoginMutation, useMeQuery, useOrdersQuery, useRegisterMutation, useVerifyPaymentMutation } from "./api";
import { clearSession, setSession, setUser, type RootState } from "./store";
import "./App.css";

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; } }
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.session.token);
  const user = useSelector((state: RootState) => state.session.user);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [busyBook, setBusyBook] = useState<string | null>(null);
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [createOrder] = useCreateOrderMutation();
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const { data: meResponse, isLoading: checkingSession, isError: sessionError } = useMeQuery(undefined, { skip: !token });
  const { data: booksResponse } = useBooksQuery(undefined, { skip: !user });
  const { data: ordersResponse } = useOrdersQuery(undefined, { skip: !user });
  const books = booksResponse?.data || [];
  const orders = ordersResponse?.data || [];

  useEffect(() => {
    if (meResponse?.data.user && !user) dispatch(setUser(meResponse.data.user));
    if (sessionError && token) dispatch(clearSession());
  }, [dispatch, meResponse, sessionError, token, user]);

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (authMode === "register") await register({ email, password }).unwrap();
      const result = await login({ email, password }).unwrap();
      dispatch(setSession(result.data));
      setNotice({ type: "success", text: authMode === "register" ? "Account created. Welcome to your shelf." : "Welcome back." });
      setPassword("");
    } catch (error) { setNotice({ type: "error", text: (error as Error).message }); }
  };

  const buy = async (book: Book) => {
    if (!user) return;
    setBusyBook(book.id);
    try {
      if (!window.Razorpay) await loadRazorpay();
      const order = await createOrder({ bookId: book.id }).unwrap();
      const paymentOrder = await createPaymentOrder({ orderId: order.data.id }).unwrap();
      if (!window.Razorpay) throw new Error("Razorpay Checkout could not be loaded");
      const checkout = new window.Razorpay({ key: paymentOrder.data.keyId, amount: paymentOrder.data.amount, currency: paymentOrder.data.currency, name: "Leaf & Lore", description: book.title, prefill: { email: user.email }, theme: { color: "#c45735" }, modal: { ondismiss: () => setBusyBook(null) }, handler: async (response: Record<string, string>) => {
        try { await verifyPayment(response).unwrap(); setNotice({ type: "success", text: "Payment verified. Your book is ready to download." }); } catch (error) { setNotice({ type: "error", text: (error as Error).message }); } finally { setBusyBook(null); }
      } });
      checkout.open();
    } catch (error) { setBusyBook(null); setNotice({ type: "error", text: (error as Error).message }); }
  };

  const download = async (bookId: string, title: string) => {
    const response = await fetch(`${API_URL}/books/${bookId}/download`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) { setNotice({ type: "error", text: "This book is not available for download." }); return; }
    const link = document.createElement("a"); link.href = URL.createObjectURL(await response.blob()); link.download = `${title}.pdf`; link.click(); URL.revokeObjectURL(link.href);
  };

  if (checkingSession) return null;
  if (!user) return <Box className="auth-page"><Box className="auth-panel"><Typography className="brand">LEAF <span>&</span> LORE</Typography><Typography className="eyebrow">THE DIGITAL BOOKSHELF</Typography><Typography variant="h1">Stories worth<br /><em>keeping.</em></Typography><Typography className="lead">Sign in to explore the collection and keep your next chapter close.</Typography>{notice && <Alert severity={notice.type}>{notice.text}</Alert>}<Box component="form" onSubmit={submitAuth} className="auth-form"><TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} slotProps={{ htmlInput: { minLength: 8 } }} required /><Button type="submit" variant="contained">{authMode === "login" ? "Sign in" : "Create account"}</Button><Button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>{authMode === "login" ? "Need an account? Register" : "Already registered? Sign in"}</Button></Box></Box></Box>;

  return <><AppBar position="sticky" elevation={0} color="transparent"><Toolbar className="toolbar"><Typography className="brand">LEAF <span>&</span> LORE</Typography><Box sx={{ flexGrow: 1 }} /><Button className="purchased-link" href="#purchased-books">Purchased Books</Button><Typography className="user-email">{user.email}</Typography><Button onClick={() => dispatch(clearSession())}>Log out</Button></Toolbar></AppBar><main><section className="intro"><Typography className="eyebrow">THE DIGITAL BOOKSHELF</Typography><Typography variant="h1">Stories worth<br /><em>keeping.</em></Typography><Typography className="lead">A small, thoughtful collection of books for curious minds. Read deeply, return often.</Typography></section>{notice && <Container maxWidth="lg"><Alert severity={notice.type} onClose={() => setNotice(null)}>{notice.text}</Alert></Container>}<Container maxWidth="lg" className="catalog"><Box className="section-heading" sx={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}><Box><Typography className="eyebrow">OUR COLLECTION</Typography><Typography variant="h2">Find your next chapter</Typography></Box><Typography className="book-count">{books.length} titles</Typography></Box><Box className="book-grid">{books.map((book) => <Card className="book-card" key={book.id}><CardMedia component="div" className="cover" image={book.coverImage ? `${API_URL.replace(/\/api$/, "")}${book.coverImage}` : undefined}><span>{book.title.slice(0, 1)}</span></CardMedia><CardContent><Typography className="book-title">{book.title}</Typography><Typography className="author">{book.author}</Typography><Typography className="description">{book.description}</Typography></CardContent><CardActions><Typography className="price">₹{book.price}</Typography><Button variant="contained" disabled={busyBook === book.id} onClick={() => buy(book)}>{busyBook === book.id ? "Opening..." : "Buy book"}</Button></CardActions></Card>)}</Box></Container><Container id="purchased-books" maxWidth="lg" className="orders"><Divider /><Typography className="eyebrow">YOUR SHELF</Typography><Typography variant="h2">Purchased books</Typography>{orders.length === 0 ? <Typography className="muted">Your purchased books will appear here.</Typography> : <Box className="order-list">{orders.map((order) => <Box className="order-row" key={order.id}><Box><Typography className="book-title">{order.book.title}</Typography><Typography className="author">{order.book.author} · ₹{order.amount}</Typography></Box>{order.status === "PAID" ? <Button onClick={() => download(order.bookId, order.book.title)}>Download</Button> : <Typography className="pending">Payment pending</Typography>}</Box>)}</Box>}</Container></main></>;
}

function loadRazorpay() { return new Promise<void>((resolve, reject) => { const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => resolve(); script.onerror = () => reject(new Error("Could not load Razorpay Checkout")); document.body.appendChild(script); }); }

export default App;
