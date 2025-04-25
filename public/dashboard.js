document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        document.getElementById("totalClients").innerText = data.clients;
        document.getElementById("totalTickets").innerText = data.tickets;
        document.getElementById("totalLeads").innerText = data.leads;

        const ctx1 = document.getElementById("ticketChart").getContext("2d");
        new Chart(ctx1, {
            type: "doughnut",
            data: {
                labels: ["Ouverts", "Fermés", "En attente"],
                datasets: [{
                    data: [data.ticketsOpen, data.ticketsClosed, data.ticketsPending],
                    backgroundColor: ["#007bff", "#28a745", "#ffc107"]
                }]
            }
        });

        const ctx2 = document.getElementById("leadChart").getContext("2d");
        new Chart(ctx2, {
            type: "bar",
            data: {
                labels: ["Nouveaux", "En cours", "Convertis"],
                datasets: [{
                    label: "Leads",
                    data: [data.leadsNew, data.leadsInProgress, data.leadsConverted],
                    backgroundColor: "#17a2b8"
                }]
            }
        });
    } catch (error) {
        console.error("Erreur lors du chargement des données", error);
    }
});
