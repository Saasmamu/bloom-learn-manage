import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  MessageCircle, 
  Search, 
  User,
  Check,
  CheckCheck
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  sent_at: string;
  read_at: string | null;
  thread_id: string | null;
}

interface Contact {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchContacts();
      subscribeToMessages();
    }
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
      markMessagesAsRead(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContacts = async () => {
    try {
      // Get all users this user has messaged with
      const { data: sentMessages } = await supabase
        .from("messages")
        .select("recipient_id")
        .eq("sender_id", user?.id);

      const { data: receivedMessages } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("recipient_id", user?.id);

      const contactIds = new Set<string>();
      sentMessages?.forEach(m => contactIds.add(m.recipient_id));
      receivedMessages?.forEach(m => contactIds.add(m.sender_id));

      // Also get all users they can message (all profiles except self)
      const { data: allUsers } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .neq("id", user?.id)
        .limit(50);

      // Get roles for users
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

      // Get unread counts
      const { data: unreadMessages } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("recipient_id", user?.id)
        .is("read_at", null);

      const unreadCounts = new Map<string, number>();
      unreadMessages?.forEach(m => {
        unreadCounts.set(m.sender_id, (unreadCounts.get(m.sender_id) || 0) + 1);
      });

      // Get last message for each contact
      const contactsWithMessages = await Promise.all(
        (allUsers || []).map(async (profile) => {
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, sent_at")
            .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${profile.id}),and(sender_id.eq.${profile.id},recipient_id.eq.${user?.id})`)
            .order("sent_at", { ascending: false })
            .limit(1)
            .single();

          return {
            id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            role: roleMap.get(profile.id) || "student",
            lastMessage: lastMsg?.content,
            lastMessageTime: lastMsg?.sent_at,
            unreadCount: unreadCounts.get(profile.id) || 0,
          };
        })
      );

      // Sort by last message time (contacts with messages first)
      contactsWithMessages.sort((a, b) => {
        if (!a.lastMessageTime && !b.lastMessageTime) return 0;
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      });

      setContacts(contactsWithMessages);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user?.id})`)
        .order("sent_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
    }
  };

  const markMessagesAsRead = async (contactId: string) => {
    try {
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", contactId)
        .eq("recipient_id", user?.id)
        .is("read_at", null);

      // Update local unread count
      setContacts(prev =>
        prev.map(c =>
          c.id === contactId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (error: any) {
      console.error("Error marking messages as read:", error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new as Message;
          // Only add if relevant to this user
          if (newMsg.sender_id === user?.id || newMsg.recipient_id === user?.id) {
            if (
              selectedContact &&
              (newMsg.sender_id === selectedContact.id || newMsg.recipient_id === selectedContact.id)
            ) {
              setMessages(prev => [...prev, newMsg]);
              if (newMsg.sender_id === selectedContact.id) {
                markMessagesAsRead(selectedContact.id);
              }
            } else if (newMsg.sender_id !== user?.id) {
              // Update unread count for other contacts
              setContacts(prev =>
                prev.map(c =>
                  c.id === newMsg.sender_id
                    ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: newMsg.content, lastMessageTime: newMsg.sent_at }
                    : c
                )
              );
            }
            // Refresh contacts to update last message
            fetchContacts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user?.id,
        recipient_id: selectedContact.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, "h:mm a");
    }
    return format(date, "MMM d, h:mm a");
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Send and receive messages</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Contacts List */}
        <Card className="lg:col-span-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No contacts found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedContact?.id === contact.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={contact.avatar_url || undefined} />
                        <AvatarFallback>{getInitials(contact.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{contact.full_name}</span>
                          {contact.unreadCount ? (
                            <Badge variant="default" className="ml-2">
                              {contact.unreadCount}
                            </Badge>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {contact.role}
                          </Badge>
                          {contact.lastMessage && (
                            <span className="text-xs text-muted-foreground truncate">
                              {contact.lastMessage.slice(0, 20)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(selectedContact.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedContact.full_name}</h3>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {selectedContact.role}
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start a conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isMine = message.sender_id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isMine
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className={`flex items-center gap-1 mt-1 text-xs ${
                              isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}>
                              <span>{formatMessageTime(message.sent_at)}</span>
                              {isMine && (
                                message.read_at ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageCircle className="h-16 w-16 mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-sm">Choose a contact to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
