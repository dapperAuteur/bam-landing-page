<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Deleted the Feature That Linked My Bank
Slug:    i-deleted-the-feature-that-linked-my-bank
Excerpt: My money app could log in to my bank and pull in every purchase. Only
         one person used it: me. I took it out. Here is why a feature nobody
         uses is not free, and how to turn one off without making a mess.
Tags:    Buying Software, Privacy, Plain Talk, CentenarianOS, WitUS
-->

# I Deleted the Feature That Linked My Bank

My app, CentenarianOS, tracks money along with health and time. For a while it could connect to your bank. You logged in once, and every purchase showed up on its own.

It sounds great. It was also the riskiest thing in the whole app. This month I took it out.

## Who was using it

I checked before deciding. Five people had ever used the money part of the app. One person had ever connected a bank: me. My six bank connections had not pulled anything new since April.

So the feature was doing nothing for anyone. But it was still **holding something**.

## What an unused feature still costs

To read your bank, the app kept a key for each bank account. Each key was locked up, but it was still a key. If someone broke in, those keys were the prize.

The feature also needed:

- a monthly bill from the company that connects to banks,
- special security files on the server,
- a door left open so the bank company could send updates.

Every one of those is something to keep safe, keep paid, and keep working. None of them helped anyone.

That is the quiet cost of software. **A feature you don't use is not neutral. It is a risk you keep paying for.**

## How I turned it off without a mess

The order mattered more than anything.

1. **Hand back the keys first.** Before deleting any code, I ran a one-time script. It told each bank "this app is done," then wiped every stored key. All six came back "revoked."
2. **Keep the history.** The 762 purchases the feature had already pulled in stayed. They are now ordinary records. Deleting a feature should not delete your past.
3. **Then delete the code.** Only after the keys were gone did I remove the screens, the buttons, and the settings.
4. **Give people a way forward.** In its place, you now upload the statement your bank already gives you, as a spreadsheet file or a PDF. The app reads it, shows you what it found, and asks before saving anything. Your login never touches my app.

If I had deleted the code first, I would have lost the easy way to hand back the keys. They would have sat in the database with nothing left that knew how to cancel them.

## The question to ask

When a vendor shows you a long feature list, ask:

> "Which of these features hold my passwords, keys, or private data, and how many customers actually use them?"

A feature that holds your keys and is barely used is a bad trade. Ask whether you can turn it off. Ask what happens to your data when you do.

## What this means when you hire

Listen for people who talk about **removing** things, not just adding them.

Two questions I would ask:

- "Tell me about a feature you took out. How did you decide, and what did you do first?"
- "If we stopped using a service tomorrow, what would still be sitting in our systems?"

A good answer names an order of steps. "First we cancel the access, then we delete the code." A weak answer is "we'd just turn it off."

## What's left

The statement upload works today for spreadsheet files and for the PDF statements from one card company. More banks are being added. It is slower than a live connection. You upload once a month instead of never. I think that is a fair price for not keeping anyone's bank keys.
